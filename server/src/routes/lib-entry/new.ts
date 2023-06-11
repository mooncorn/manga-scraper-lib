import express from "express";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares/validate-request";
import { LibEntry } from "../../models/lib-entry";
import { BadRequestError } from "../../errors/bad-request-error";
import { Types } from "mongoose";
import { currentUser } from "../../middlewares/current-user";
import { requireAuth } from "../../middlewares/require-auth";

const router = express.Router();

const validationRules = [
  body("url").isURL().withMessage("Manga url must be a valid url format"),
  body("source").trim().notEmpty().withMessage("Source is required"),
];

router.post(
  "/api/lib-entry",
  validateRequest(validationRules),
  currentUser,
  requireAuth,
  async (req, res) => {
    const { url, source } = req.body;
    const user = new Types.ObjectId(req.user!.id);

    const found = await LibEntry.findOne({ url, user });
    if (found) {
      throw new BadRequestError("Manga is already in the library");
    }

    const manga = LibEntry.build({ user, url, source });
    await manga.save();

    res.status(201).json({ manga });
  }
);

export { router as newLibEntryRouter };
