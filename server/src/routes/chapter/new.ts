import express from "express";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares/validate-request";
import { BadRequestError } from "../../errors/bad-request-error";
import { Chapter } from "../../models/chapter";
import { Types } from "mongoose";
import { Manga } from "../../models/manga";

const router = express.Router();

const validationRules = [
  body("url").isURL().withMessage("Url must be of valid format"),
  body("title").isString().notEmpty().withMessage("Title field is required"),
  body("manga").isString().notEmpty().withMessage("Manga field is required"),
  body("pages").isArray().withMessage("Pages field is required"),
];

//TODO: add auth to scrappers
router.post(
  "/api/chapter",
  validateRequest(validationRules),
  async (req, res) => {
    const { url, title, manga, pages } = req.body;
    const mangaId = new Types.ObjectId(manga);

    const mangaFound = await Manga.findOne({ _id: mangaId });
    if (!mangaFound) {
      throw new BadRequestError("Manga with this id does not exist");
    }

    const found = await Chapter.findOne({ url });
    if (found) {
      throw new BadRequestError("Chapter already exists");
    }

    const chapter = Chapter.build({
      url,
      title,
      manga: mangaId,
      pages,
    });
    await chapter.save();

    res.status(201).json({ chapter });
  }
);

export { router as newChapterRouter };
