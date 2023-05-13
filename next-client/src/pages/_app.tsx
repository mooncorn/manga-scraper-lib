import server from "@/api/server";
import { UserModel } from "@/components/AuthForm";
import Header from "@/components/Header";
import type { AppContext, AppProps } from "next/app";
import App from "next/app";

type CustomAppProps = Pick<AppProps, "Component" | "pageProps"> & {
  currentUser?: UserModel;
};

export default function CustomApp({
  Component,
  pageProps,
  currentUser,
}: CustomAppProps) {
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
