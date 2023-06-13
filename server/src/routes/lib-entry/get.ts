import express from "express";
import { currentUser } from "../../middlewares/current-user";
import { requireAuth } from "../../middlewares/require-auth";
import { LibEntry } from "../../models/lib-entry";
import { Types } from "mongoose";
import { Manga } from "../../models/manga";

const router = express.Router();

router.get("/api/library", currentUser, requireAuth, async (req, res) => {
  const user = new Types.ObjectId(req.user!.id);

  const library = await LibEntry.find({ user });

  const mangas = [];
  for (let lib of library) {
    const manga = await Manga.findOne({ _id: lib.manga });
    mangas.push(manga);
  }

  res.status(200).json({ library, manga: mangas });
});

export { router as getLibEntryRouter };
