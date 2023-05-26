import { UserModel } from "@/components/auth-form";
import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";

interface HomeProps {
  currentUser?: UserModel;
}

const Home = ({ currentUser }: HomeProps) => {
  return (
    <>
      <Head>
        <title>Explore</title>
      </Head>
      <main></main>
    </>
  );
};

export default Home;
