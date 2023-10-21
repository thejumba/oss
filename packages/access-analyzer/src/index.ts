import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import {
  CognitoIdentityProviderClient,
  UserType,
} from "@aws-sdk/client-cognito-identity-provider";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { HttpRequest } from "@smithy/protocol-http";
import fs from "fs";
import fetch, { Request } from "node-fetch";
import path from "path";
import { AuthModule } from "./auth.js";
import { DynamoDBModule } from "./dynamodb.js";
import { AmplifyMeta } from "./types.js";

export class AccessAnalyzer {
  private amplifyMeta: AmplifyMeta;
  private environment: string;
  private dynamodbClient: DynamoDBClient;
  private cognitoClient: CognitoIdentityProviderClient;
  private identityClient: CognitoIdentityClient;
  private currentSession?: {
    user: UserType;
    idToken: string;
    accessToken: string;
  };
  private cleanupActions: (() => Promise<void>)[] = [];

  // modules
  private authModule: AuthModule;
  private dynamodbModule: DynamoDBModule;

  constructor(
    private config: {
      /**
       * The name that you provided to your API resource in the Amplify project.
       */
      apiResourceName: string;
      /**
       * The name that you provided to your auth resource in the Amplify project.
       */
      authResourceName: string;
      /**
       * The absolute path to the directory that contains your Amplify project.
       */
      amplifyDirPath: string;
      /**
       * An optional object that contains the credentials to use to access the Amplify project.
       */
      credentials?: {
        accessKeyId: string;
        secretAccessKey: string;
        sessionToken?: string;
      };
      /**
       * The AWS region in which your Amplify project is located.
       */
      region: string;
      /**
       * A function that generates credentials for all test users. It is async because it may need to
       * make network requests to generate the credentials (such as checking if the user already exists). It must
       * return an object with the following properties:
       * - username: The username of the test user.
       * - password: The password of the test user.
       * - attributes: An object containing the attributes of the test user. The keys are the attribute names and the values are the attribute values.
       */
      userGenerator: (
        usernameExists: (username: string) => Promise<boolean>
      ) => Promise<{
        username: string;
        password: string;
        attributes: Record<string, string>;
      }>;
      /**
       * The type of Cognito App Client to use when generating credentials for test users. Cognito creates
       * two app clients by default: "default" and "web". The "default" app client is used for admin operations
       * such as creating users and signing in users. The "web" app client is used for signing in users.
       */
      useWebAppClient?: boolean;
    }
  ) {
    const metaPath = path.join(
      config.amplifyDirPath,
      "./backend/amplify-meta.json"
    );

    if (!fs.existsSync(metaPath)) {
      throw new Error(`amplify-meta.json not found at ${metaPath}`);
    }

    const meta = fs.readFileSync(metaPath, "utf8");
    this.amplifyMeta = JSON.parse(meta) as AmplifyMeta;

    // load current environment info
    const currentEnvPath = path.join(
      config.amplifyDirPath,
      "./.config/local-env-info.json"
    );

    if (!fs.existsSync(currentEnvPath)) {
      throw new Error(`local-env-info.json not found at ${currentEnvPath}`);
    }

    const currentEnv = JSON.parse(fs.readFileSync(currentEnvPath, "utf8"));
    if (!currentEnv.envName) {
      throw new Error(`local-env-info.json is invalid: envName is missing`);
    }

    this.environment = currentEnv.envName;

    // initalize clients
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: config.region,
      credentials: config.credentials,
    });

    this.identityClient = new CognitoIdentityClient({
      region: config.region,
      credentials: config.credentials,
    });

    this.dynamodbClient = new DynamoDBClient({
      region: config.region,
      credentials: config.credentials,
    });

    // set modules
    this.authModule = new AuthModule(
      this.amplifyMeta.auth[config.authResourceName],
      this.cognitoClient,
      this.identityClient,
      config.useWebAppClient ?? false
    );

    this.dynamodbModule = new DynamoDBModule(
      this.dynamodbClient,
      this.amplifyMeta.api[
        config.apiResourceName
      ].output.GraphQLAPIIdOutput.concat(`-${this.environment}`)
    );
  }

  get auth() {
    return this.authModule;
  }

  get dynamodb() {
    return this.dynamodbModule;
  }

  registerCleanupAction(action: () => Promise<void>) {
    this.cleanupActions.push(action);
  }

  async cleanup() {
    await Promise.all(this.cleanupActions.map((action) => action()));
  }

  /**
   * This method will create a test user in the Cognito User Pool with the provided credentials and
   * create a session for that user. The session will be stored in memory and used for all subsequent
   * requests.
   */
  async enhanceWithUserSession({ groups }: { groups?: string[] }) {
    this.currentSession = await this.generateUserSession({ groups });

    return this.currentSession;
  }

  async generateUserSession({ groups }: { groups?: string[] }) {
    const { username, password, attributes } = await this.config.userGenerator(
      this.auth.userExists.bind(this.auth)
    );

    const user = await this.auth.createUser(username, password, attributes);
    await this.auth.setPassword(username, password);

    if (groups) {
      await Promise.all(
        groups.map((group) => this.auth.addUserToGroup(username, group))
      );
    }

    const authResult = await this.auth.getSignInCredentials(username, password);

    if (!user || !authResult?.IdToken || !authResult.AccessToken) {
      throw new Error("Unable to create a test user session");
    }

    this.registerCleanupAction(async () => {
      await this.auth.deleteUser(username);
    });

    return {
      user,
      idToken: authResult.IdToken,
      accessToken: authResult.AccessToken,
    };
  }

  async executeGraphQL<TQuery>({
    query,
    variables,
    ...opts
  }: {
    query: string;
    public?: boolean;
    variables?: Record<string, any>;
    session?: Awaited<ReturnType<AccessAnalyzer["generateUserSession"]>>;
    cleanup?: (result: TQuery) => Promise<void>;
  }) {
    const api = this.amplifyMeta.api[this.config.apiResourceName];
    const url = api.output.GraphQLAPIEndpointOutput;

    let json: TQuery;

    if (opts.public) {
      const signature = await this.auth.getPublicSignature(this.config.region);
      const endpoint = new URL(url);
      const requestToBeSigned = new HttpRequest({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          host: endpoint.host,
        },
        hostname: endpoint.host,
        body: JSON.stringify({ query, variables }),
        path: endpoint.pathname,
      });
      const signed = await signature.sign(requestToBeSigned);
      const request = new Request(endpoint, signed);
      const response = await fetch(request);
      json = (await response.json()) as TQuery;
    } else if (!this.currentSession) {
      throw new Error(
        "You must call enhanceWithUserSession() before executing GraphQL queries"
      );
    } else {
      const accessToken =
        opts?.session?.accessToken ?? this.currentSession.accessToken!;
      const headers = {
        Authorization: accessToken,
        "Content-Type": "application/json",
      };
      const body = JSON.stringify({ query, variables });
      const response = await fetch(url, { method: "POST", headers, body });
      json = (await response.json()) as TQuery;
    }

    let response = json as any;

    if (opts?.cleanup && !response.errors) {
      this.registerCleanupAction(async () => await opts.cleanup!(json));
    }

    return {
      response: json,
      hasErrors: response.errors && response.errors.length > 0,
      isUnauthorized:
        response.errors?.some(
          (error: any) => error.errorType?.includes("Unauthorized")
        ) ?? false,
    };
  }
}
