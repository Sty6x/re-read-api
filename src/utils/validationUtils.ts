import { ExpressValidator, validationResult } from "express-validator";
import { Request } from "express";

function isValid(req: Request): { valid: boolean; message: any } {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return { valid: false, message: result.mapped() };
  }
  return { valid: true, message: "Success" };
}

function checkCaseSensitiveInputs(
  inputs: Array<string>,
  existingbook: Array<string>,
): boolean {
  const result = inputs.map(
    (s, i) => s.toLowerCase() === existingbook[i].toLowerCase(),
  );

  // if any of them are false, which means they are not the same text,
  // process something, else if there are no falsey values, which means
  // all of the contents are the same, then return true as they are

  return result.some((r) => r === false) ? false : true;
}

export { isValid, checkCaseSensitiveInputs };
