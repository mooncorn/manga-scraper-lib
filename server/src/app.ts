import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { NotFoundError } from "./errors/not-found-error";
import { errorHandler } from "./middlewares/error-handler";
import cookieSession from "cookie-session";
import cors from "cors";

import { currentUserRouter } from "./routes/auth/current-user";
import { signinRouter } from "./routes/auth/signin";
import { signoutRouter } from "./routes/auth/signout";
import { signupRouter } from "./routes/auth/signup";
import { getLibEntryRouter } from "./routes/lib-entry/get";
import { newLibEntryRouter } from "./routes/lib-entry/new";
import { deleteLibEntryRouter } from "./routes/lib-entry/delete";
import { newChapterRouter } from "./routes/chapter/new";
import { newMangaRouter } from "./routes/manga/new";
import { getMangaRouter } from "./routes/manga/get";
import { getChapterRouter } from "./routes/chapter/get";
import { getAllMangaRouter } from "./routes/manga/getAll";
import { getIdMangaRouter } from "./routes/manga/getId";
import { getIdChapterRouter } from "./routes/chapter/getId";

const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(json());
app.use(
  cookieSession({
    signed: false,
    // secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.use(getLibEntryRouter);
app.use(newLibEntryRouter);
app.use(deleteLibEntryRouter);

app.use(newChapterRouter);
app.use(getChapterRouter);
app.use(getIdChapterRouter);

app.use(newMangaRouter);
app.use(getMangaRouter);
app.use(getAllMangaRouter);
app.use(getIdMangaRouter);

app.all("*", async (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
