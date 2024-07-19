import express, { Request, Response, NextFunction } from "express";
import { matchedData } from "express-validator";
import { checkCaseSensitiveInputs, isValid } from "../../utils/validationUtils";
import BookModel from "../../models/BookModel";
import { Error } from "mongoose";
import checkExistingBook from "../../middlewares/api/checkExistingBook";
import NoteModel from "../../models/NoteModel";

async function getAllBooks(req: Request, res: Response, next: NextFunction) {
  try {
    const books = await BookModel.find({ user: { $eq: req.UserId } });
    if (books.length === 0) {
      return res
        .status(200)
        .json({ Message: `You don't have any books.`, books });
    }
    console.log(books);
    res.json({ Message: `Books retrieved`, books });
  } catch (err: any) {
    console.error(err.message);
    res.json({
      ErrorMessage: "Something went wrong, try again later.",
      errorObject: err,
    });
  }
}

async function postBook(req: Request, res: Response, next: NextFunction) {
  const { valid, message } = isValid(req);
  if (!valid) {
    return res.status(404).json({ ErrorMessage: message });
  }
  const book: { author: string; title: string } = matchedData(req);
  console.log({ author: book.author, title: book.title });
  try {
    const newBook = new BookModel({
      author: book.author.toLowerCase(),
      title: book.title.toLowerCase(),
      user: req.UserId,
    });
    await newBook.save();
    res.json({ Message: "Post book", ...book, newBook });
  } catch (err: any) {
    res.json({ ErrorMessage: err });
  }
}

async function getBook(req: Request, res: Response, next: NextFunction) {
  const { BookId } = req.params;
  try {
    const book = await BookModel.findById(BookId);
    res.json({ Message: `Book retrieved`, book });
  } catch (err: any) {
    // try to improve error handling for when querying fails for some reason
    console.error(err.message);
    res.json({ ErrorMessage: "Book does not exist.", errorObject: err });
  }
}

async function updateBook(req: Request, res: Response, next: NextFunction) {
  const { valid, message } = isValid(req);
  if (!valid) {
    return res.status(500).json({ ErrorMessage: message });
  }
  const editedBook: { author: string; title: string } = matchedData(req);
  try {
    console.log(editedBook);
    const { BookId } = req.params;
    const currentBook = await BookModel.findById(BookId);
    if (currentBook === null) {
      throw new Error("Unable to find book or Book does not exist.");
      return;
    }

    const isTheSame = checkCaseSensitiveInputs(
      Object.values({ title: editedBook.title, author: editedBook.author }),
      Object.values({
        title: currentBook.title as string,
        author: currentBook.author as string,
      }),
    );

    if (isTheSame) {
      return res.json({
        Message: "Input redundant, please enter a different title/author.",
      });
    }
    currentBook.title = editedBook.title;
    currentBook.author = editedBook.author;
    currentBook.lastUpdated = new Date();
    await currentBook.save();
    res.json({ Message: "Book updated", currentBook, editedBook });
  } catch (err: any) {
    // try to improve error handling for when querying fails for some reason
    console.error(err.message);
    res.json({
      ErrorMessage: "Unable to update book, try again later.",
      errorObject: err,
    });
  }
}

async function removeBook(req: Request, res: Response, next: NextFunction) {
  // when removing a book, with notes, remove all of the notes related to this book
  const { BookId } = req.params;

  try {
    const book = await BookModel.findById(BookId);
    if (book === null) {
      return res.status(404).json({
        ErrorMessage: "This book does not exist.",
        notesDeleted: false,
      });
    }
    const deleteNotes = await NoteModel.deleteMany({ book: { $eq: book._id } }); //whose book's id field is the same as book
    if (!deleteNotes.acknowledged) {
      throw new Error(
        "Unable to remove notes from this book or has been already deleted. ",
      );
    }
    await book.deleteOne();
    res.json({
      Message: `${book.title?.toUpperCase()} by ${book.author?.toUpperCase()} along with ${book.notes.length} notes have been deleted.`,
      notesDeleted: deleteNotes.acknowledged,
    });
  } catch (err: any) {
    console.error(err.message);
    res.json({
      ErrorMessage:
        "There was problem when trying to delete this book, try again later.",
      errorObject: err,
      notesDeleted: false,
    });
  }
}

export { postBook, getBook, updateBook, removeBook, getAllBooks };
