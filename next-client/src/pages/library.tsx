import { UserModel } from "@/components/auth-form";
import { useRequireUser } from "@/hooks/useRequireUser";

interface LibraryProps {
  currentUser: UserModel | null;
}

const Library = ({ currentUser }: LibraryProps) => {
  useRequireUser(currentUser); // protect route from unauthorized access

  return <h1>Library</h1>;
};

export default Library;
