import server from "@/api/server";
import { UserModel } from "@/components/auth-form";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function useRequireUser(currentUser: UserModel | null) {
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/signin");
    }
  }, []);
}
