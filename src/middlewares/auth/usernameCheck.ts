import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import UserModel from "../../models/UserModel";

export default async (req: Request, res: Response, next: NextFunction) => {
  const userID = req.UserId;
  try {
    const user = await UserModel.findById(userID);
    if (user === null) {
      res.clearCookie("token");
      res.json({
        message: "User not found",
        redirect: { canNavigate: true, route: "/auth/login" },
      });
      return;
    }
    if (user.username === "") throw new Error("Please enter your username");
    res.json({
      message: "Successfully created username.",
      userData: req.user,
      redirect: { canNavigate: true, route: "/app" },
    });
  } catch (err: any) {
    next({
      name: "UserQueryError",
      message: err.message,
    });
  }
};
