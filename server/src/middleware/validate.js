import { validationResult } from 'express-validator';
import { sendError } from '../utils/apiResponse.js';

const validate = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = result.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return sendError(res, 'Validation failed', 400, errors);
  }

  next();
};

export default validate;
