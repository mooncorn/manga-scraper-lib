import { Dispatch, FormEvent, useState } from "react";
import { UserModel } from "../App";
import { useRequest } from "../hooks/useRequest";

interface AuthFormProps {
  url: string;
  setUser: Dispatch<React.SetStateAction<UserModel | undefined>>;
}

const AuthForm = ({ url, setUser }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { send, errors } = useRequest({
    url,
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: (data: UserModel) => setUser(data),
  });

  const signUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await send();
  };

  return (
    <>
      <form
        style={{ maxWidth: 600 }}
        className="mx-auto mt-3"
        onSubmit={signUp}
      >
        {errors.length > 0 && (
          <div className="alert alert-danger mb-2">
            <h4>Oops...</h4>
            <ul>
              {errors.map((error) => (
                <li key={error.message}>{error.message}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </>
  );
};

export default AuthForm;
