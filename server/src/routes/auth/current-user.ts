import express from "express";
import { currentUser } from "../../middlewares/current-user";

const router = express.Router();

router.get("/api/users/currentuser", currentUser, (req, res) => {
  console.log(req.user);
  res.json({ currentUser: req.user || null });
});

export { router as currentUserRouter };
