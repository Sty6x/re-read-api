import express, { Express, NextFunction, Request, Response } from "express";
import {
  getBookNotes,
  getUserNotes,
  postNote,
  removeNote,
  updateNotes,
} from "../../../handlers/api_handlers/noteHandlers";
import apiValidator from "../../../middlewares/api/validator";
import { getBook } from "../../../handlers/api_handlers/bookHandlers";
const router = express.Router();

router.get("/notes", getUserNotes);
router.get("/books/:BookId/notes", getBookNotes); // get post put delete methods
router.post("/books/:BookId/notes", apiValidator.notes(), postNote);
router.put("/books/:BookId/notes/:NoteId", apiValidator.notes(), updateNotes);
router.delete("/books/:BookId/notes/:NoteId", removeNote);
export default router;
