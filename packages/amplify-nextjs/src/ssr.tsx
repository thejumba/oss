import { API, Amplify, Auth, Storage, withSSRContext } from "aws-amplify";

type SSRContext = Omit<typeof Amplify, "Auth" | "API" | "Storage"> & {
  Auth: typeof Auth;
  API: typeof API;
  Storage: typeof Storage;
};

export function getSSRContext({ headers }: { headers: any }): SSRContext {
  const req = {
    headers: {
      cookie: headers().get("cookie"),
    },
  };

  const SSR = withSSRContext({ req });

  return SSR;
}
