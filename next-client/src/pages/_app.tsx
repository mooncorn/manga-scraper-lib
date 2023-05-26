import server from "@/api/server";
import { UserModel } from "@/components/auth-form";
import Header from "@/components/header";
import type { AppContext, AppProps } from "next/app";
import App from "next/app";
import { useEffect, useState } from "react";

export type CustomAppProps = Pick<AppProps, "Component" | "pageProps"> & {
  currentUser: UserModel | null;
};

export default function CustomApp({
  Component,
  pageProps,
  currentUser,
}: CustomAppProps) {
  useEffect(() => {}, []);

  return (
    <>
      <Header currentUser={currentUser} />
      <Component {...{ ...pageProps, currentUser }} />
    </>
  );
}

CustomApp.getInitialProps = async (context: AppContext) => {
  const { pageProps } = await App.getInitialProps(context);

  try {
    const { data } = await server.get("/api/users/currentuser", {
      withCredentials: true,
      headers: context.ctx.req?.headers,
    });

    return { pageProps, ...data };
  } catch (e) {
    return { pageProps };
  }
};
function AdblockerPlugin(): any {
  throw new Error("Function not implemented.");
}

function StealthPlugin(): any {
  throw new Error("Function not implemented.");
}
