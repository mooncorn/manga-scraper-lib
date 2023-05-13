import { useRequest } from "@/hooks/useRequest";
import { useRouter } from "next/router";
import { useEffect } from "react";

const SignOut = () => {
  const router = useRouter();
  const { send } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => router.push("/"),
  });

  useEffect(() => {
    send();
  }, []);

  return <div className="text-center my-5">Signing you out...</div>;
};

export default SignOut;
