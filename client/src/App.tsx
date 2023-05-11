import React, { useState } from "react";
import Header from "./components/Header";
import MainContent, { PageName } from "./components/MainContent";

function App() {
  const [contentPage, setContentPage] = useState<PageName>("Explore");

  return (
    <>
      <Header setContentPage={setContentPage} />
      <MainContent contentPage={contentPage} />
    </>
  );
}

export default App;
