import express from "express";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares/validate-request";
import { BadRequestError } from "../../errors/bad-request-error";
import { Manga } from "../../models/manga";

const router = express.Router();

const validationRules = [
  body("url").isURL().withMessage("Url must be of valid format"),
  body("source").isString().notEmpty().withMessage("Source field is required"),
  body("title").isString().notEmpty().withMessage("Title field is required"),
  body("imgUrl").isURL().withMessage("Image url must be of valid format"),
];

//TODO: add auth to scrappers
router.post(
  "/api/manga",
  validateRequest(validationRules),
  async (req, res) => {
    const { url, source, title, imgUrl } = req.body;

    const found = await Manga.findOne({ url });
    if (found) {
      throw new BadRequestError("Manga already exists");
    }

    const manga = Manga.build({
      url,
      title,
      source,
      imgUrl,
    });
    await manga.save();

    res.status(201).json({ manga });
  }
);

export { router as newMangaRouter };
