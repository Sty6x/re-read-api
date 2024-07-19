import { Request, Response, NextFunction } from "express";
import BookModel from "../../models/BookModel";
import { warn } from "console";

export default async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { author, title }: { author: string; title: string } = req.body;
  // users might use uppercase for initital characters
  // need to set all to lowercase so its easier to discern
  // if a book exists
  try {
    const isBookExist = await BookModel.exists({
      author: author.toLowerCase(),
      title: title.toLowerCase(),
    });
    if (isBookExist !== null) {
      throw new Error("Book already exists.");
    }
    next();
  } catch (err: any) {
    res.json({ ErrorMessage: err.message, bookData: { author, title } });
  }
}
