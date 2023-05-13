import axios from "axios";
import { NextPageContext } from "next";

export default ({ req }: NextPageContext) => {
  return axios.create({
    baseURL: "http://localhost:3001",
    headers: req?.headers,
    withCredentials: true,
  });
};
