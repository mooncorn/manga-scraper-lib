import express from "express";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares/validate-request";
import { Manga } from "../../models/manga";
import { NotFoundError } from "../../errors/not-found-error";

const router = express.Router();

//TODO: add auth to scrappers
router.get("/api/manga/all", async (req, res) => {
  const manga = await Manga.find();

  res.status(200).json({ manga });
});

export { router as getAllMangaRouter };
