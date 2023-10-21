import fs from "fs";
import path from "path";
import { AmplifyMeta, AmplifyMetaSchema } from "./types.js";
import {
  CognitoIdentityProviderClient,
  UserType,
} from "@aws-sdk/client-cognito-identity-provider";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AuthModule } from "./auth.js";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";

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

  // modules
  private authModule: AuthModule;

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
      userGenerator: () => Promise<{
        username: string;
        password: string;
        attributes: Record<string, string>;
      }>;
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
    const result = AmplifyMetaSchema.safeParse(JSON.parse(meta));

    if (result.success === false) {
      throw new Error(
        `amplify-meta.json is invalid: ${result.error.flatten().formErrors[0]}`
      );
    }

    this.amplifyMeta = result.data;

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
      this.identityClient
    );
  }

  get auth() {
    return this.authModule;
  }

  /**
   * This method will create a test user in the Cognito User Pool with the provided credentials and
   * create a session for that user. The session will be stored in memory and used for all subsequent
   * requests.
   */
  async enhanceWithUserSession({ groups }: { groups?: string[] }) {
    this.currentSession = await this.generateUserSession({ groups });
  }

  async generateUserSession({ groups }: { groups?: string[] }) {
    const { username, password, attributes } =
      await this.config.userGenerator();

    const user = await this.auth.createUser(username, password, attributes);

    if (groups) {
      await Promise.all(
        groups.map((group) => this.auth.addUserToGroup(username, group))
      );
    }

    const authResult = await this.auth.getSignInCredentials(username, password);

    if (!user || !authResult?.IdToken || !authResult.AccessToken) {
      throw new Error("Unable to create a test user session");
    }

    return {
      user,
      idToken: authResult.IdToken,
      accessToken: authResult.AccessToken,
    };
  }
}
