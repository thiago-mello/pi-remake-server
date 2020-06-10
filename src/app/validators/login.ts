import * as yup from 'yup';
import { Request, Response, NextFunction } from 'express';

async function validateLogin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | any> {
  const rules = yup.object().shape({
    email: yup
      .string()
      .email()
      .matches(/@elojr.com.br$/)
      .required(),
    password: yup.string().min(8).required(),
  });

  try {
    await rules.validate(req.body);
    return next();
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'Dados Inválidos' });
  }
}

export default {
  validateLogin,
};
