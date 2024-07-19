import express, { Express, NextFunction, Request, Response } from "express";
import booksRoutes from "./bookRoutes";
import noteRoutes from "./noteRoutes";
import apiValidator from "../../../middlewares/api/validator";
import checkExistingBook from "../../../middlewares/api/checkExistingBook";
import userHandlers from "../../../handlers/api_handlers/userHandlers";
const router = express.Router();

declare module "express" {
  export interface Request {
    UserId?: string; // Add your custom property here
  }
}
router.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to API" });
});

router.use("/:UserId", (req: Request, res: Response, next: NextFunction) => {
  req.UserId = req.params.UserId;
  next();
});

router.use("/:UserId/settings/change", userHandlers.update);
router.use("/:UserId", noteRoutes);
router.use("/:UserId", booksRoutes);
router.get("/:UserId/all", (req: Request, res: Response) => {
  console.log("Fetch everything from user");
  res.json({ message: "Get all books and notes" });
});

export default router;
