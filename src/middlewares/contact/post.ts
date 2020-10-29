import { body } from 'express-validator';

const validations = [
  body('name').exists().withMessage("Missing field 'Name'"),
  body('name')
    .if(body('name').exists())
    .isLength({ min: 1 })
    .withMessage('name need at least one character'),
];

export  default validations