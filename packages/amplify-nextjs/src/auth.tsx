"use client";

import type { CognitoUser } from "amazon-cognito-identity-js";
import { Auth, Hub } from "aws-amplify";
import Link from "next/link";
import { redirect, usePathname, useSearchParams } from "next/navigation";
import * as React from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface UserAttributes {
  sub: string;
  email: string;
  phone_number: string;
  name: string;
}

interface AuthContextType {
  user: CognitoUser | undefined;
  userAttributes: UserAttributes | undefined;
  loading?: boolean;
  error?: Error | undefined;
  loginSession: CognitoUser | undefined;
  loginCredentials?: { username: string; password: string };
  sessionType?: "login" | "signup" | "confirm";
  redirectUrl?: string;
}

export const AuthContext = createContext<
  | (AuthContextType & {
      set: <T extends keyof AuthContextType>(
        key: T,
        value: AuthContextType[T]
      ) => void;
      inGroup: (groups: string[]) => boolean;
      signIn: (data: { username: string; password: string }) => Promise<void>;
      signUp: (data: {
        name: string;
        password: string;
        phone: string;
        email: string;
        attributes?: Record<string, string>;
      }) => Promise<void>;
      signOut: () => Promise<void>;
      resendVerificationCode: () => Promise<void>;
      confirmVerificationCode: (code: string) => Promise<void>;
    })
  | null
>(null);

export function AmplifyAuthProvider({
  loader: Loader = null,
  children,
  publicRoutes,
  allowedGroups,
  authLinks = {
    signIn: "/auth/sign-in",
    signUp: "/auth/sign-up",
    verify: "/auth/verify",
    resetPassword: "/auth/reset-password",
  },
  renderUnauthorized,
  redirectUnauthorized,
}: {
  loader?: React.ReactNode;
  children: React.ReactNode;
  publicRoutes?: string[];
  allowedGroups?: string[];
  authLinks?: {
    signIn: string;
    signUp: string;
    verify: string;
    resetPassword: string;
  };
  renderUnauthorized?: React.FC;
  redirectUnauthorized?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const linkRef = useRef<HTMLAnchorElement>(null);

  const [error, setError] = useState<Error | undefined>();
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<AuthContextType>({
    user: undefined,
    userAttributes: undefined,
    loginSession: undefined,
    redirectUrl: undefined,
  });
  const set = <T extends keyof AuthContextType>(
    key: T,
    value: AuthContextType[T]
  ) => setAuth((prev) => ({ ...prev, [key]: value }));

  const isAuthPage = Object.values(authLinks).some((link) =>
    pathname.startsWith(link)
  );

  useEffect(() => {
    // use Hub to listen for auth events
    Hub.listen("auth", ({ payload }) => {
      const { event } = payload;
      if (event === "signIn") {
        void loadUser();
      }
    });

    const loadUser = async () => {
      try {
        const user: CognitoUser & { attributes: UserAttributes } =
          await Auth.currentAuthenticatedUser();
        setAuth((prev) => ({
          ...prev,
          user,
          userAttributes: user.attributes,
        }));
      } catch (e: unknown) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    void loadUser();
  }, []);

  if (loading) {
    return <>{Loader}</>;
  }

  // redirect stored in url
  if (auth.redirectUrl) {
    linkRef.current?.click();
    setAuth((prev) => ({ ...prev, redirectUrl: undefined }));
  }

  // authed user trying to access auth pages
  if (auth.user && isAuthPage) {
    const next = searchParams.get("next");
    redirect(next || "/");
  }

  // unauther trying to access protected pages
  if (!auth.user && !publicRoutes?.includes(pathname) && !isAuthPage) {
    redirect(`${authLinks.signIn}?next=${pathname}`);
  }

  // pages that require a pre-existing session
  if (
    !auth.loginSession &&
    [authLinks.resetPassword, authLinks.verify].some((r) =>
      pathname.startsWith(r)
    )
  ) {
    redirect(authLinks.signIn);
  }

  // if required/allowed groups are defined
  if (
    auth.user &&
    allowedGroups &&
    !allowedGroups.some((group) => inGroup([group]))
  ) {
    if (redirectUnauthorized) {
      redirect(redirectUnauthorized);
    } else if (renderUnauthorized) {
      return <>{renderUnauthorized}</>;
    }
  }

  function inGroup(groups: string[]) {
    return groups.some(
      (group) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- wrong cognito types
        (auth.user as any)?.signInUserSession?.idToken?.payload?.[
          "cognito:groups"
        ]?.includes(group)
    );
  }

  async function signIn({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    try {
      const data: CognitoUser = await Auth.signIn(username, password);
      const params = decodeURIComponent(searchParams.toString());
      if (data.challengeName === "NEW_PASSWORD_REQUIRED") {
        setAuth((prev) => ({
          ...prev,
          loginSession: data,
          redirectUrl: `/auth/reset-password${params ? `?${params}` : ""}`,
          loginCredentials: { username, password },
          sessionType: "login",
        }));
      } else if (data.challengeName === "SMS_MFA") {
        setAuth((prev) => ({
          ...prev,
          loginSession: data,
          redirectUrl: `/auth/verify${params ? `?${params}` : ""}`,
          loginCredentials: { username, password },
          sessionType: "login",
        }));
      }
    } catch (e) {
      setError(e as Error);
      throw e;
    }
  }

  async function signOut() {
    setLoading(true);
    try {
      await Auth.signOut();
      set("user", undefined);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }

  async function confirmVerificationCode(code: string) {
    try {
      if (auth.sessionType === "signup") {
        await Auth.confirmSignUp(auth.loginCredentials?.username || "", code);
      } else {
        await Auth.confirmSignIn(auth.loginSession, code);
      }
    } catch (e) {
      setError(e as Error);
      throw e;
    }
  }

  async function resendVerificationCode() {
    try {
      if (auth.sessionType === "login") {
        const data: CognitoUser = await Auth.signIn(
          auth.loginCredentials?.username || "",
          auth.loginCredentials?.password
        );

        setAuth((prev) => ({
          ...prev,
          loginSession: data,
        }));
      } else {
        await Auth.resendSignUp(auth.loginCredentials?.username || "");
      }
    } catch (e) {
      setError(e as Error);
      throw e;
    }
  }

  async function signUp({
    name,
    password,
    phone,
    email,
    attributes,
  }: {
    password: string;
    name: string;
    phone: string;
    email: string;
    attributes?: Record<string, string>;
  }) {
    try {
      const { user } = await Auth.signUp({
        username: phone,
        password,
        attributes: {
          name,
          email,
          phone_number: phone,
          ...attributes,
        },
      });

      const params = decodeURIComponent(searchParams.toString());
      let redirectUrl = `${authLinks.signIn}${params ? `?${params}` : ""}`;

      if (user.challengeName === "SMS_MFA") {
        redirectUrl = `${authLinks.verify}${params ? `?${params}` : ""}`;
      }
      setAuth((prev) => ({
        ...prev,
        redirectUrl,
        loginSession: user,
        loginCredentials: { username: phone, password },
        sessionType: "signup",
      }));
    } catch (e) {
      setError(e as Error);
      throw e;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        set,
        ...auth,
        error,
        loading,
        signIn,
        inGroup,
        signUp,
        signOut,
        confirmVerificationCode,
        resendVerificationCode,
      }}
    >
      {/* prefer link navigation over router methods */}
      <Link
        href={auth.redirectUrl || "#"}
        ref={linkRef}
        style={{
          display: "none",
        }}
      />

      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
