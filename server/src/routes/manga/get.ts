import express from "express";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares/validate-request";
import { Manga } from "../../models/manga";
import { NotFoundError } from "../../errors/not-found-error";

const router = express.Router();

const validationRules = [
  body("url").isURL().withMessage("Url must be of valid format"),
];

//TODO: add auth to scrappers
router.get("/api/manga", validateRequest(validationRules), async (req, res) => {
  const { url } = req.body;

  const manga = await Manga.findOne({ url });

  if (!manga) {
    throw new NotFoundError();
  }

  res.status(200).json({ manga });
});

export { router as getMangaRouter };
