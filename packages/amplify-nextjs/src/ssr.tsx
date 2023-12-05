import { API, Amplify, Auth, Storage, withSSRContext } from "aws-amplify";
import { headers } from "next/headers";

const req = {
  headers: {
    cookie: headers().get("cookie"),
  },
};

export const SSR: Omit<typeof Amplify, "Auth" | "API" | "Storage"> & {
  Auth: typeof Auth;
  API: typeof API;
  Storage: typeof Storage;
} = withSSRContext({ req });
