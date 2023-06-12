import express from "express";
import { body, query } from "express-validator";
import { validateRequest } from "../../middlewares/validate-request";
import { Manga } from "../../models/manga";

const router = express.Router();

const validationRules = [
  query("page").isInt().toInt().optional(),
  query("search").optional(),
];

//TODO: add auth to scrappers
router.get(
  "/api/manga/all",
  validateRequest(validationRules),
  async (req, res) => {
    const { page, search } = req.query;
    const limit = 40;

    let manga = [];

    if (page) {
      manga = await Manga.find({ title: { $regex: search, $options: "i" } })
        .limit(limit * 1)
        .skip((Number(page) - 1) * limit)
        .exec();

      const count = await Manga.count();

      res.status(200).json({
        manga,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      });
    } else {
      manga = await Manga.find();

      res.status(200).json({ manga });
    }
  }
);

export { router as getAllMangaRouter };
