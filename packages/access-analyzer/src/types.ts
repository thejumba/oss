import * as z from "zod";

export const AwscloudformationSchema = z.object({
  AuthRoleName: z.string(),
  UnauthRoleArn: z.string(),
  AuthRoleArn: z.string(),
  Region: z.string(),
  DeploymentBucketName: z.string(),
  UnauthRoleName: z.string(),
  StackName: z.string(),
  StackId: z.string(),
  AmplifyAppId: z.string(),
  AuthTriggerTemplateURL: z.string(),
});
export type Awscloudformation = z.infer<typeof AwscloudformationSchema>;

export const ProvidersSchema = z.object({
  awscloudformation: AwscloudformationSchema,
});
export type Providers = z.infer<typeof ProvidersSchema>;

export const AuthOutputSchema = z.object({
  CreatedSNSRole: z.string(),
  UserPoolId: z.string(),
  AppClientIDWeb: z.string(),
  AppClientID: z.string(),
  IdentityPoolId: z.string(),
  UserPoolArn: z.string(),
  IdentityPoolName: z.string(),
  UserPoolName: z.string(),
});
export type AuthOutput = z.infer<typeof AuthOutputSchema>;

export const PasswordProtectionSettingsSchema = z.object({
  passwordPolicyMinLength: z.number(),
  passwordPolicyCharacters: z.array(z.any()),
});
export type PasswordProtectionSettings = z.infer<
  typeof PasswordProtectionSettingsSchema
>;

export const FrontendAuthConfigSchema = z.object({
  mfaConfiguration: z.string(),
  mfaTypes: z.array(z.string()),
  passwordProtectionSettings: PasswordProtectionSettingsSchema,
  signupAttributes: z.array(z.string()),
  socialProviders: z.array(z.any()),
  usernameAttributes: z.array(z.string()),
  verificationMechanisms: z.array(z.string()),
});
export type FrontendAuthConfig = z.infer<typeof FrontendAuthConfigSchema>;

export const ProviderMetadataSchema = z.object({
  s3TemplateURL: z.string(),
  logicalId: z.string(),
});
export type ProviderMetadata = z.infer<typeof ProviderMetadataSchema>;

export const UserPoolConfigSchema = z.object({
  userPoolId: z.string(),
});
export type UserPoolConfig = z.infer<typeof UserPoolConfigSchema>;

export const DefaultAuthenticationSchema = z.object({
  authenticationType: z.string(),
  userPoolConfig: UserPoolConfigSchema,
});
export type DefaultAuthentication = z.infer<typeof DefaultAuthenticationSchema>;

export const AdditionalAuthenticationProviderSchema = z.object({
  authenticationType: z.string(),
});
export type AdditionalAuthenticationProvider = z.infer<
  typeof AdditionalAuthenticationProviderSchema
>;

export const InnerAuthSchema = z.object({
  additionalAuthenticationProviders: z.array(
    AdditionalAuthenticationProviderSchema
  ),
  defaultAuthentication: DefaultAuthenticationSchema,
});
export type InnerAuth = z.infer<typeof InnerAuthSchema>;

export const ApiOutputSchema = z.object({
  authConfig: InnerAuthSchema,
  GraphQLAPIIdOutput: z.string(),
  GraphQLAPIEndpointOutput: z.string(),
});
export type ApiOutput = z.infer<typeof ApiOutputSchema>;

export const DependsOnSchema = z.object({
  attributes: z.array(z.string()),
  category: z.string(),
  resourceName: z.string(),
  triggerProvider: z.union([z.null(), z.string()]).optional(),
});
export type DependsOn = z.infer<typeof DependsOnSchema>;

export const ApiConfigSchema = z.object({
  dependsOn: z.array(DependsOnSchema),
  output: ApiOutputSchema,
  providerPlugin: z.string(),
  service: z.string(),
  lastPushTimeStamp: z.coerce.date(),
  providerMetadata: ProviderMetadataSchema,
});
export type ApiConfig = z.infer<typeof ApiConfigSchema>;

export const AuthConfigSchema = z.object({
  customAuth: z.boolean(),
  dependsOn: z.array(DependsOnSchema),
  frontendAuthConfig: FrontendAuthConfigSchema,
  providerPlugin: z.string(),
  service: z.string(),
  output: AuthOutputSchema,
  lastPushTimeStamp: z.coerce.date(),
  providerMetadata: ProviderMetadataSchema,
});
export type AuthConfig = z.infer<typeof AuthConfigSchema>;

export const AuthSchema = z.record(z.string(), AuthConfigSchema);
export type Auth = z.infer<typeof AuthSchema>;

export const ApiSchema = z.record(z.string(), ApiConfigSchema);
export type Api = z.infer<typeof ApiSchema>;

export const AmplifyMetaSchema = z.object({
  providers: ProvidersSchema,
  api: ApiSchema,
  auth: AuthSchema,
});
export type AmplifyMeta = z.infer<typeof AmplifyMetaSchema>;
