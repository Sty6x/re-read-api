import { Request, Response, NextFunction } from "express";
import UserModel from "../../models/UserModel";
import { matchedData } from "express-validator";
import { isValid } from "../../utils/validationUtils";

async function update(req: Request, res: Response, next: NextFunction) {
  const { valid, message } = isValid(req);
  if (!valid) {
    console.log(message);
    return res.status(404).json({ ErrorMessage: message });
  }
  const dataQueryString = matchedData(req);
  console.log(dataQueryString);
  const userID = req.query.userID;
  const { username, email, password } = req.query;
  console.log({ username, userID });
  try {
    const updateUser = await UserModel.findByIdAndUpdate(
      userID,
      {
        $set: {
          username,
          email,
        },
      },
      { new: true },
    );

    console.log(updateUser);
    if (updateUser === null) throw new Error("User null");
    updateUser.save();
    res.json({
      message: `Successfully updated your ${Object.keys(req.query)[0]}`,
      redirect: { canNavigate: true, route: "/app" },
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
