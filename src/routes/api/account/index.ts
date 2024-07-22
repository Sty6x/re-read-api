import express, { Request, Response, NextFunction } from "express";
import userHandlers from "../../../handlers/api_handlers/userHandlers";
import validator from "../../../middlewares/api/validator";
const router = express.Router();

declare module "express" {
  export interface Request {
    UserId?: string; // Add your custom property here
  }
}
router.use("/", (req: Request, res: Response, next: NextFunction) => {
  next();
});

router.post("/change", validator.userAccount, userHandlers.update);

export default router;
