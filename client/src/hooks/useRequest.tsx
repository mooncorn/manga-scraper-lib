import axios, { AxiosError } from "axios";
import { useState } from "react";

interface useRequestProps {
  url: string;
  method: "post" | "get" | "delete" | "put";
  body: any;
  onSuccess: (data: any) => void;
}

export function useRequest({ url, method, body, onSuccess }: useRequestProps) {
  const [errors, setErrors] = useState<{ message: string }[]>([]);

  const send = async () => {
    try {
      setErrors([]);

      const response = await axios[method](url, body);

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
