import express from "express";
import { body, param, query } from "express-validator";
import { validateRequest } from "../../middlewares/validate-request";
import { Manga } from "../../models/manga";
import { NotFoundError } from "../../errors/not-found-error";
import { Chapter } from "../../models/chapter";

const router = express.Router();

const validationRules = [param("id").isMongoId()];

//TODO: add auth to scrappers
router.get(
  "/api/manga/:id",
  validateRequest(validationRules),
  async (req, res) => {
    const { id } = req.params;

    const manga = await Manga.findOne({ _id: id });
    const chapters = await Chapter.find({ manga: id });

    if (!manga) {
      throw new NotFoundError();
    }

    res.status(200).json({ manga, chapters });
  }
);

export { router as getIdMangaRouter };
