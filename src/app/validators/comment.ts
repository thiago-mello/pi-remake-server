import * as yup from 'yup';
import { Request, Response, NextFunction } from 'express';

async function validateComment(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> {
  const rules = yup.object().shape({
    content: yup.string().required().max(280),
    post: yup.number().integer().min(1).required(),
  });

  try {
    await rules.validate(req.body);
    return next();
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'Dados inválidos.' });
  }
}

export default { validateComment };
