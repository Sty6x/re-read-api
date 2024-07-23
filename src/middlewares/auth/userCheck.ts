import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import UserModel from "../../models/UserModel";

export default async (req: Request, res: Response, next: NextFunction) => {
  const userID = req.query.userID || req.params.UserId;
  console.log(userID);
  try {
    const user = await UserModel.findById(userID);
    console.log(user);
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
      message: "Login successful.",
      userData: req.user,
      redirect: { canNavigate: true, route: "/app/home" },
    });
  } catch (err: any) {
    next({
      name: "UserQueryError",
      message: "Something went wrong, please try again later.",
    });
  }
};
