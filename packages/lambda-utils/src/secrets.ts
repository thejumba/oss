import {
    GetParameterCommand,
    GetParametersCommand,
    SSMClient,
} from "@aws-sdk/client-ssm";

export async function getAmplifySecret(secretName: string) {
  const client = new SSMClient();
  const command = new GetParameterCommand({
    Name: process.env[secretName[0]] || "",
    WithDecryption: true,
  });
  const { Parameter } = await client.send(command);

  return Parameter?.Value;
}

export async function getMultipleAmplifySecrets(secretNames: string[]) {
  const client = new SSMClient();
  const command = new GetParametersCommand({
    Names: secretNames.map((secretName) => process.env[secretName] || ""),
    WithDecryption: true,
  });
  const { Parameters } = await client.send(command);

  return Parameters?.reduce(
    (acc, curr) => {
      if (curr) {
        const name = secretNames.find(
          (secretName) => curr.Name?.endsWith(secretName)
        );
        if (name) acc[name] = curr.Value || "";
      }
      return acc;
    },
    {} as Record<string, string>
  );
}
