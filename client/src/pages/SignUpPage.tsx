import { Dispatch } from "react";
import { UserModel } from "../App";
import AuthForm from "../components/AuthForm";

interface SignUpPageProps {
  setUser: Dispatch<React.SetStateAction<UserModel | undefined>>;
}

const SignUpPage = ({ setUser }: SignUpPageProps) => {
  return (
    <div>
      <h1 className="my-3 text-center">Sign Up</h1>
      <AuthForm url={"/api/users/signup"} setUser={setUser} />
    </div>
  );
};

export default SignUpPage;
