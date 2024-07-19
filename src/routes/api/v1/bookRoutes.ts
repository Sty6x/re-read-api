import express, { Express, NextFunction, Request, Response } from "express";
import {
  postBook,
  getBook,
  updateBook,
  removeBook,
  getAllBooks,
} from "../../../handlers/api_handlers/bookHandlers";
import checkExistingBook from "../../../middlewares/api/checkExistingBook";
import apiValidator from "../../../middlewares/api/validator";

const router = express.Router();

router.get("/books", getAllBooks);
router.get("/books/:BookId", getBook); // get post put delete methods
router.post("/books", apiValidator.books(), checkExistingBook, postBook);
router.put("/books/:BookId", apiValidator.books(), updateBook);
router.delete("/books/:BookId", removeBook);
export default router;
