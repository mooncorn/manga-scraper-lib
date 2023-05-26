import AuthForm from "@/components/auth-form";
import Head from "next/head";

export default function SignUp() {
  return (
    <>
      <Head>
        <title>Sign Up</title>
      </Head>
      <main>
        <AuthForm heading="Sign Up" url="/api/users/signup" />
      </main>
    </>
  );
}
