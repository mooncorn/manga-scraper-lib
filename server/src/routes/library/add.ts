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
  body("source").trim().notEmpty().withMessage("Source is required"),
];

router.post(
  "/api/library/add",
  validateRequest(validationRules),
  currentUser,
  requireAuth,
  async (req, res) => {
    const { url, source } = req.body;
    const userId = req.user!.id;

    const found = await Manga.findOne({ url, userId });
    if (found) {
      throw new BadRequestError("Manga is already in the library");
    }

    const manga = Manga.build({ userId, url, source });
    await manga.save();

    res.status(201).json({ manga });
  }
);

export { router as currentUserRouter };
