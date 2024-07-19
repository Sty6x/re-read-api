import { query, body } from "express-validator";
import { escape } from "querystring";
import emailExist from "./emailExist";

const register = [
  body("email").custom(emailExist).trim().notEmpty().isEmail().escape(),
  body("password").trim().notEmpty().escape().isLength({ min: 8, max: 16 }),
];

const login = [
  body("email").trim().notEmpty().isEmail().escape(),
  body("password").trim().notEmpty().escape().isLength({ min: 8, max: 16 }),
];
export default { register, login };
