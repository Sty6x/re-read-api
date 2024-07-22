import { warn } from "console";
import { checkSchema } from "express-validator";

function books() {
  console.log("Validator triggered");
  return checkSchema(
    {
      title: {
        isString: {
          errorMessage: "Invalid input data type.",
        },
        notEmpty: true,
        escape: true,
        errorMessage: "Title must not be empty.",
      },
      author: {
        isString: {
          errorMessage: "Invalid input data type.",
        },
        notEmpty: true,
        escape: true,
        errorMessage: "Author must not be empty.",
      },
    },
    ["body"],
  );
}

function userAccount() {
  return checkSchema(
    {
      username: {
        escape: true,
        isString: true,
        notEmpty: true,
        errorMessage: "Invalid input data type.",
      },
    },
    ["query"],
  );
}

function notes() {
  return checkSchema(
    {
      contents: {
        escape: true,
        isString: true,
      },
      noteNumber: {
        isInt: {
          options: { min: 0 },
        },
        errorMessage: "Invalid input data type.",
        notEmpty: true,
      },
      page: {
        isInt: {
          options: { min: 0 },
        },
        notEmpty: true,
        errorMessage: "Invalid input data type.",
      },
    },
    ["body"],
  );
}

export default { books, notes, userAccount };
