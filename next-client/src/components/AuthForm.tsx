import { useRequest } from "@/hooks/useRequest";
import { Router, useRouter } from "next/router";
import { Dispatch, FormEvent, useState } from "react";

interface AuthFormProps {
  url: string;
  heading: string;
}

export interface UserModel {
  id: string;
  email: string;
}

const AuthForm = ({ url, heading }: AuthFormProps) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { send, errors } = useRequest({
    url,
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => router.push("/"),
  });

  const signUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await send();
  };

  return (
    <>
      <h2 className="text-center my-4">{heading}</h2>
      <form
        style={{ maxWidth: 600 }}
        className="mx-auto mt-3"
        onSubmit={signUp}
      >
        {errors && (
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
