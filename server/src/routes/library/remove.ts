import express from "express";
import { currentUser } from "../../middlewares/current-user";
import { requireAuth } from "../../middlewares/require-auth";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares/validate-request";
import { Manga } from "../../models/manga";
import { BadRequestError } from "../../errors/bad-request-error";

const router = express.Router();

const validationRules = [
  body("url").isURL().withMessage("Manga url must be a valid url format"),
];

router.delete(
  "/api/library/remove",
  validateRequest(validationRules),
  currentUser,
  requireAuth,
  async (req, res) => {
    const { url } = req.body;
    const userId = req.user!.id;

    const found = await Manga.findOne({ url, userId });
    if (!found) {
      throw new BadRequestError("Manga is not in the library");
    }

    await Manga.deleteOne({ url, userId });

    res.status(200).json(found);
  }
);

export { router as removeMangaRouter };
