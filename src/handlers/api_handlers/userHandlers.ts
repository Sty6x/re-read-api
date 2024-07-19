import { Request, Response, NextFunction } from "express";
import UserModel from "../../models/UserModel";

async function update(req: Request, res: Response, next: NextFunction) {
  const userID = req.UserId;
  const updatedFields = req.query;
  const changes: { email: string; password: string; username: string } =
    req.body;
  console.log(updatedFields);
  try {
    const updateUser = await UserModel.findByIdAndUpdate(userID, updatedFields);
    res.json({
      message: `Successfully updated your ${Object.keys(updatedFields)[0]}`,
    });
  } catch (err) {
    next({
      message:
        "Unable to change settings at the moment, please try again later.",
      name: "UpdateError",
    });
  }
}

export default { update };
