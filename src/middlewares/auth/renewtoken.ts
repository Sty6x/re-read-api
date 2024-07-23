const secret = process.env.SECRET_KEY as string;
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
  const jwtToken = jwt.sign(
    { email: req.user.email, password: req.user.password, role: "user" },
    secret,
  );
  res.cookie("token", jwtToken, {
    sameSite: "none",
    secure: true,
    httpOnly: true,
    //maxAge: 5000,
  });
  res.json({
    message: "New session",
    userData: req.user,
    redirect: { canNavigate: true, route: "/app/home" },
  });
};
