import {query} from 'express-validator';

const validations = [
  query('id').exists().withMessage("Missing field 'id'"),
];

export default validations;