import express from "express";
import { currentUser } from "../../middlewares/current-user";
import { requireAuth } from "../../middlewares/require-auth";
import { Manga } from "../../models/manga";

const router = express.Router();

router.get("/api/library", currentUser, requireAuth, async (req, res) => {
  const userId = req.user!.id;

  const library = await Manga.find({ userId });

  res.status(200).json({ library });
});

export { router as getLibraryRouter };
