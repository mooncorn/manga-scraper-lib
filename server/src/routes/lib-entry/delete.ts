import express from "express";
import { currentUser } from "../../middlewares/current-user";
import { requireAuth } from "../../middlewares/require-auth";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares/validate-request";
import { LibEntry } from "../../models/lib-entry";
import { BadRequestError } from "../../errors/bad-request-error";
import { Types } from "mongoose";

const router = express.Router();

const validationRules = [
  body("url").isURL().withMessage("Manga url must be a valid url format"),
];

router.delete(
  "/api/lib-entry",
  validateRequest(validationRules),
  currentUser,
  requireAuth,
  async (req, res) => {
    const { url } = req.body;
    const user = new Types.ObjectId(req.user!.id);

    const found = await LibEntry.findOne({ url, user });
    if (!found) {
      throw new BadRequestError("Manga is not in the library");
    }

    await LibEntry.deleteOne({ url, user });

    res.status(200).json(found);
  }
);

export { router as deleteLibEntryRouter };
