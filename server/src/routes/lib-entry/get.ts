import express from "express";
import { currentUser } from "../../middlewares/current-user";
import { requireAuth } from "../../middlewares/require-auth";
import { LibEntry } from "../../models/lib-entry";
import { Types } from "mongoose";

const router = express.Router();

router.get("/api/lib-entry", currentUser, requireAuth, async (req, res) => {
  const user = new Types.ObjectId(req.user!.id);

  const library = await LibEntry.find({ user });

  res.status(200).json({ library });
});

export { router as getLibEntryRouter };
