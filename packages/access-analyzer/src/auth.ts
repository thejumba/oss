import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminSetUserPasswordCommand,
  AdminAddUserToGroupCommand,
  AdminRemoveUserFromGroupCommand,
  AdminInitiateAuthCommand,
  AdminGetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { AuthConfig } from "./types.js";
import {
  GetIdCommand,
  CognitoIdentityClient,
  GetCredentialsForIdentityCommand,
} from "@aws-sdk/client-cognito-identity";
import { SignatureV4 } from "@smithy/signature-v4";
import { Sha256 } from "@aws-crypto/sha256-js";

export class AuthModule {
  constructor(
    private config: AuthConfig,
    private cognitoClient: CognitoIdentityProviderClient,
    private identityClient: CognitoIdentityClient
  ) {}

  async createUser(
    username: string,
    password: string,
    attributes: Record<string, string>
  ) {
    const result = await this.cognitoClient.send(
      new AdminCreateUserCommand({
        UserPoolId: this.config.output.UserPoolId,
        Username: username,
        TemporaryPassword: password,
        UserAttributes: Object.entries(attributes).map(([Name, Value]) => ({
          Name,
          Value,
        })),
      })
    );

    return result.User;
  }

  async deleteUser(username: string) {
    await this.cognitoClient.send(
      new AdminDeleteUserCommand({
        UserPoolId: this.config.output.UserPoolId,
        Username: username,
      })
    );
  }

  async getUser(username: string) {
    const result = await this.cognitoClient.send(
      new AdminGetUserCommand({
        UserPoolId: this.config.output.UserPoolId,
        Username: username,
      })
    );

    return result;
  }

  async userExists(username: string) {
    try {
      await this.getUser(username);
      return true;
    } catch (e: any) {
      if (e.name === "UserNotFoundException") {
        return false;
      }

      throw e;
    }
  }

  async setPassword(username: string, password: string) {
    await this.cognitoClient.send(
      new AdminSetUserPasswordCommand({
        UserPoolId: this.config.output.UserPoolId,
        Username: username,
        Password: password,
        Permanent: true,
      })
    );
  }

  async addUserToGroup(username: string, groupName: string) {
    await this.cognitoClient.send(
      new AdminAddUserToGroupCommand({
        UserPoolId: this.config.output.UserPoolId,
        Username: username,
        GroupName: groupName,
      })
    );
  }

  async removeUserFromGroup(username: string, groupName: string) {
    await this.cognitoClient.send(
      new AdminRemoveUserFromGroupCommand({
        UserPoolId: this.config.output.UserPoolId,
        Username: username,
        GroupName: groupName,
      })
    );
  }

  async getSignInCredentials(username: string, password: string) {
    const result = await this.cognitoClient.send(
      new AdminInitiateAuthCommand({
        UserPoolId: this.config.output.UserPoolId,
        ClientId: this.config.output.AppClientIDWeb,
        AuthFlow: "ADMIN_USER_PASSWORD_AUTH",
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        },
      })
    );

    return result.AuthenticationResult;
  }

  async getPublicSignature(region: string) {
    const { IdentityId } = await this.identityClient.send(
      new GetIdCommand({
        IdentityPoolId: this.config.output.IdentityPoolId,
      })
    );

    if (!IdentityId) {
      throw new Error("Unable to get identity ID");
    }

    const { Credentials } = await this.identityClient.send(
      new GetCredentialsForIdentityCommand({
        IdentityId,
      })
    );

    if (!Credentials) {
      throw new Error("Unable to get credentials");
    }

    return new SignatureV4({
      credentials: {
        accessKeyId: Credentials!.AccessKeyId!,
        secretAccessKey: Credentials!.SecretKey!,
        sessionToken: Credentials!.SessionToken!,
        expiration: Credentials!.Expiration!,
      },
      service: "appsync",
      region: region,
      sha256: Sha256,
    });
  }
}
