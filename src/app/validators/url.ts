import * as yup from 'yup';
import { Request, Response, NextFunction } from 'express';

async function validateUrl(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> {
  const rules = yup.object().shape({
    id: yup.number().integer().min(1),
    page: yup.number().integer().min(1),
  });

  try {
    await rules.validate({ ...req.params, ...req.query });
    return next();
  } catch (err) {
    return res.status(400).json({ error: 'Dados Inválidos' });
  }
}

export default {
  validateUrl,
};
