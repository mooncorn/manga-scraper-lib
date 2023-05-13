import server from "@/api/server";
import { AxiosError } from "axios";
import { useState } from "react";

interface useRequestProps {
  url: string;
  method: "post" | "get" | "delete" | "put";
  body: any;
  onSuccess: (data: any) => void;
}

export function useRequest({ url, method, body, onSuccess }: useRequestProps) {
  const [errors, setErrors] = useState<{ message: string }[] | null>(null);

  const send = async () => {
    try {
      setErrors(null);

      const response = await server[method](url, body);

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        setErrors(err.response?.data?.errors);
      }
    }
  };

  return { send, errors };
}
