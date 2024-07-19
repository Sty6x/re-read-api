import express, { Request, Response, NextFunction } from "express";
import { matchedData } from "express-validator";
import { checkCaseSensitiveInputs, isValid } from "../../utils/validationUtils";
import BookModel from "../../models/BookModel";
import NoteModel from "../../models/NoteModel";

async function postNote(req: Request, res: Response) {
  const { valid, message } = isValid(req);
  if (!valid) {
    return res.status(404).json({ ErrorMessage: message });
  }
  const note: { contents: string; noteNumber: number; page: number } =
    matchedData(req);
  const userId = req.UserId;
  const { BookId } = req.params;
  try {
    const newNote = new NoteModel({
      contents: note.contents,
      noteNumber: note.noteNumber,
      page: note.page,
      user: userId,
      book: BookId,
    });
    await newNote.save();
    const book = await BookModel.findByIdAndUpdate(BookId, {
      $push: { notes: newNote._id },
    });
    if (book === null) {
      throw new Error("Book does not exist");
    }
    res.status(200).json({ newNote, book });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ErrorMessage: "Unable to create a new note." });
  }
}

async function getUserNotes(req: Request, res: Response) {
  const userId = req.UserId;
  try {
    const notes = await NoteModel.find({ user: userId }).populate("book");
    console.log(notes.length);
    res.json({ notes });
  } catch (err) {
    res.status(500).json({ ErrorMessage: `Unable to retrieve notes.` });
  }
}

async function getBookNotes(req: Request, res: Response) {
  const userId = req.UserId;
  const { BookId } = req.params;
  try {
    const notes = await NoteModel.find({ user: userId, book: BookId }).populate(
      "book",
    );
    console.log(notes.length);
    res.json({ notes });
  } catch (err) {
    res.status(500).json({ ErrorMessage: `Unable to retrieve notes.` });
  }
}

async function updateNotes(req: Request, res: Response) {
  const userId = req.UserId;
  const { BookId, NoteId } = req.params;
  const { valid, message } = isValid(req);
  if (!valid) {
    return res.status(404).json({ ErrorMessage: message });
  }
  const editNote: { contents: string } = req.body;
  try {
    const note = await NoteModel.findById(NoteId);
    if (note === null) {
      throw new Error("Note does not exist.");
    }
    const isContentsTheSame = checkCaseSensitiveInputs(
      [editNote.contents],
      [note.contents as string],
    );
    if (isContentsTheSame) {
      return res.status(200).json({
        Message: "The contents is the same as the previous.",
        updated: false,
      });
    }
    note.contents = editNote.contents;
    await note.save();
    res.status(200).json({ Message: "Note updated.", updated: true });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(500)
      .json({ ErrorMessage: `Unable to update notes.`, updated: false });
  }
}

async function removeNote(req: Request, res: Response, next: NextFunction) {
  const { BookId, NoteId } = req.params;
  try {
    const book = await BookModel.findByIdAndUpdate(BookId, {
      $pull: { notes: NoteId },
    });
    const deleteNote = await NoteModel.findByIdAndDelete(NoteId);
    if (book === null || deleteNote == null) {
      return res.status(404).json({
        ErrorMessage: "Something went wrong when deleting this note.",
        notesDeleted: false,
      });
    }
    const notePresent = await NoteModel.exists({ _id: NoteId });
    if (notePresent) {
      throw new Error("There was an issue removing this note.");
    }
    res.json({
      Message: `Successfully removed a note.`,
      notesDeleted: true,
    });
  } catch (err: any) {
    console.error(err.message);
    res.json({
      ErrorMessage:
        "There was problem when trying to delete a note, try again later.",
      errorObject: err,
      notesDeleted: false,
    });
  }
}

export { postNote, getBookNotes, updateNotes, getUserNotes, removeNote };
