import ExplorePage from "../pages/ExplorePage";
import LibraryPage from "../pages/LibraryPage";
import SearchPage from "../pages/SearchPage";
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";

export type PageName = "Explore" | "Search" | "Library" | "SignIn" | "SignUp";

interface MainContentProps {
  contentPage: PageName;
}

const MainContent = ({ contentPage }: MainContentProps) => {
  const renderContentPage = () => {
    switch (contentPage) {
      case "Explore":
        return <ExplorePage />;
      case "Search":
        return <SearchPage />;
      case "Library":
        return <LibraryPage />;
      case "SignIn":
        return <SignInPage />;
      case "SignUp":
        return <SignUpPage />;
    }
  };

  return <>{renderContentPage()}</>;
};

export default MainContent;
