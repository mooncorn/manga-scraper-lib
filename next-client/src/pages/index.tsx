import { UserModel } from "@/components/AuthForm";
import { NextPage } from "next";
import Head from "next/head";

interface HomeProps {
  currentUser?: UserModel;
}

const Home = ({ currentUser }: HomeProps) => {
  return (
    <>
      <Head>
        <title>Explore</title>
      </Head>
      <main>
        {currentUser ? (
          <h1>You are signed in</h1>
        ) : (
          <h1>You are not signed in</h1>
        )}
      </main>
    </>
  );
};

export default Home;
