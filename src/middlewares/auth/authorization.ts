import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import UserModel from "../../models/UserModel";

const secret = process.env.SECRET_KEY as string;

async function authorizeUser(req: Request, res: Response, next: NextFunction) {
  const clientToken = req.cookies["token"];
  try {
    const payload = jwt.verify(clientToken, secret);
    console.log(payload);
    next();
  } catch (err: any) {
    next(err);
  }
}

export default authorizeUser;
