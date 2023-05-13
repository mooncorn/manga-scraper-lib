import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import MainContent, { PageName } from "./components/MainContent";
import server from "./api/server";

export interface UserModel {
  id: string;
  email: string;
}

function App() {
  const [contentPage, setContentPage] = useState<PageName>("Explore");
  const [user, setUser] = useState<UserModel>();

  useEffect(() => {
    auth();
  }, []);

  const auth = async () => {
    try {
      const res = await server.get<UserModel>("api/users/currentuser");
      setUser(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Header setContentPage={setContentPage} />
      <MainContent contentPage={contentPage} setUser={setUser} />
    </>
  );
}

export default App;
