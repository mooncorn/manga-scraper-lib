import express, { Request, Response } from "express";
import { body } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../models/user";
import { validateRequest } from "../../middlewares/validate-request";
import { BadRequestError } from "../../errors/bad-request-error";

const router = express.Router();

const validationRules = [
  body("email").isEmail().withMessage("Email must be valid"),
  body("password").trim().notEmpty().withMessage("Password is required"),
];

router.post(
  "/api/users/signin",
  validateRequest(validationRules),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials.");
    }

    // check if provided password matches with the password of existing user
    const passwordsMatch = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!passwordsMatch) {
      throw new BadRequestError("Invalid credentials.");
    }

    const token = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY!
    );
    req.session = { jwt: token };

    res.json({ user: existingUser });
  }
);

export { router as signinRouter };
