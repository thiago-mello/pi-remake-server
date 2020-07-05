import * as yup from 'yup';
import { Request, Response, NextFunction } from 'express';

async function validatePost(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> {
  const rules = yup.object().shape({
    title: yup.string().required(),
    content: yup.string().required(),
  });

  try {
    await rules.validate(req.body);
    return next();
  } catch (err) {
    return res.status(400).json({ error: 'Dados inválidos.' });
  }
}

export default { validatePost };
