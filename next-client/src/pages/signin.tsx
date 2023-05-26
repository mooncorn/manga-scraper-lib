import AuthForm from "@/components/auth-form";
import Head from "next/head";

export default function SignIn() {
  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      <main>
        <AuthForm heading="Sign In" url="/api/users/signin" />
      </main>
    </>
  );
}
