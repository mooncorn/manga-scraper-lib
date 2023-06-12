import express from "express";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares/validate-request";
import { Manga } from "../../models/manga";
import { NotFoundError } from "../../errors/not-found-error";
import { Chapter } from "../../models/chapter";

const router = express.Router();

const validationRules = [
  body("url").isURL().withMessage("Url must be of valid format"),
];

//TODO: add auth to scrappers
router.get(
  "/api/chapter",
  validateRequest(validationRules),
  async (req, res) => {
    const { url } = req.body;

    const chapter = await Chapter.findOne({ url });

    if (!chapter) {
      throw new NotFoundError();
    }

    res.status(200).json({ chapter });
  }
);

export { router as getChapterRouter };
