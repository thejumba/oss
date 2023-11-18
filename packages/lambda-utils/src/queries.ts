import { Sha256 } from "@aws-crypto/sha256-js";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { HttpRequest } from "@smithy/protocol-http";
import { SignatureV4 } from "@smithy/signature-v4";
import fetch, { Request } from "node-fetch";

type QueryFnConfig = {
  AWS_REGION?: string;
  GRAPHQL_ENDPOINT?: string;
};

export async function graphqlQuery(
  query: string,
  variables = {},
  config: QueryFnConfig = {
    // default to values provided by amplify when lambda linked to an appsync api
    AWS_REGION: process.env.REGION,
    GRAPHQL_ENDPOINT: process.env.API_JUMBA_GRAPHQLAPIENDPOINTOUTPUT,
  }
) {
  const { AWS_REGION, GRAPHQL_ENDPOINT } = config;
  if (!AWS_REGION || !GRAPHQL_ENDPOINT) {
    throw new Error(
      `Missing aws region or graphql endpoint in env vars. Use 'QueryClient' to pass these values directly rather than reading from env vars.`
    );
  }

  const endpoint = new URL(GRAPHQL_ENDPOINT);
  const signer = new SignatureV4({
    credentials: defaultProvider(),
    region: AWS_REGION,
    service: "appsync",
    sha256: Sha256,
  });

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
  const signed = await signer.sign(requestToBeSigned);
  const request = new Request(endpoint, signed);

  // Execute the request with exponential backoff and retry when a 5xx error is encountered
  const MAX_RETRIES = 5;
  let retryCount = 0;

  while (true) {
    try {
      const response = await fetch(request);
      if (response.status >= 500 && retryCount < MAX_RETRIES) {
        // retry on 5xx errors
        retryCount++;
        let backoff = 2 ** retryCount * 100;
        console.info(`Retrying after ${backoff}ms (attempt ${retryCount})`);
        await new Promise((resolve) => setTimeout(resolve, backoff));
        continue;
      }
      return response.json() as any;
    } catch (error: any) {
      console.error(error.message);
      console.error(error.stack);
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        let backoff = 2 ** retryCount * 100;
        console.info(`Retrying after ${backoff}ms (attempt ${retryCount})`);
        await new Promise((resolve) => setTimeout(resolve, backoff));
        continue;
      }
      throw error; // rethrow the error after retries are exhausted
    }
  }
}

export async function executeGraphqlQuery<TData, TQuery>({
  query,
  variables,
  queryName,
  fetchAllItems,
  config,
}: {
  query: string;
  queryName: keyof TQuery;
  fetchAllItems?: boolean;
  variables?: {
    limit?: number;
    nextToken?: string;
    filter?: Record<string, any>;
    input?: Partial<TData>;
  } & Record<string, any>;
  config?: QueryFnConfig;
}): Promise<TData> {
  if (fetchAllItems) {
    const items = [];
    let nextToken = null;

    do {
      const response = await graphqlQuery(
        query,
        {
          limit: 1000,
          ...variables,
          nextToken,
        },
        config
      );

      if (response.errors && response.errors.length > 0) {
        throw new Error(JSON.stringify(response.errors[0]));
      }

      items.push(...response.data[queryName].items);
      nextToken = response.data[queryName].nextToken;
    } while (nextToken);

    return items as TData;
  } else {
    const response = await graphqlQuery(query, variables, config);

    if (response.errors && response.errors.length > 0) {
      throw new Error(JSON.stringify(response.errors[0]));
    }

    return response.data[queryName];
  }
}

export class QueryClient {
  constructor(
    private config: {
      AWS_REGION: string;
      GRAPHQL_ENDPOINT: string;
    }
  ) {}

  async query<TData, TQuery>({
    query,
    variables,
    queryName,
    fetchAllItems,
  }: {
    query: string;
    queryName: keyof TQuery;
    fetchAllItems?: boolean;
    variables?: {
      limit?: number;
      nextToken?: string;
      filter?: Record<string, any>;
      input?: Partial<TData>;
    } & Record<string, any>;
  }): Promise<TData> {
    return executeGraphqlQuery<TData, TQuery>({
      query,
      variables,
      queryName,
      fetchAllItems,
      config: this.config,
    });
  }
}
