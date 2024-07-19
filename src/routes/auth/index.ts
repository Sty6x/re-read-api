import express, { Express, NextFunction, Request, Response } from "express";
import authHandlers from "../../handlers/auth";
import authValidator from "../../middlewares/auth/validator";
import { query } from "express-validator";
import renewtoken from "../../middlewares/auth/renewtoken";
const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  // auth redirect
  res.json({ redirect: "/auth/login" });
});
router.post("/register", authValidator.register, authHandlers.register);
router.post("/login", authValidator.login, authHandlers.login, renewtoken);

export default router;
