import UserModel from "../../../models/UserModel";

export default async (value: string) => {
  const existingUser = await UserModel.findOne({ email: value });
  if (existingUser !== null) {
    throw new Error("Email already Exists");
  }
};
