import { body, validationResult } from "express-validator";

export const validateQuiz = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("questions")
    .isArray({ min: 1 })
    .withMessage("Questions must be an array with at least one question"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
