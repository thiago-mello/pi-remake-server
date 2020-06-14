import * as yup from 'yup';
import { Request, Response, NextFunction } from 'express';

async function validateUserCreation(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | any> {
  const rules = yup.object().shape({
    name: yup.string().max(255).required(),
    email: yup
      .string()
      .email()
      .matches(/@elojr.com.br$/)
      .required(),
    password: yup.string().min(8).required(),
    passwordConfirm: yup
      .string()
      .required()
      .oneOf([yup.ref('password')]),
    team: yup.number().min(1).required(),
  });

  try {
    await rules.validate(req.body);
    return next();
  } catch (err) {
    return res.status(400).json({ error: 'Dados Inválidos' });
  }
}

export default {
  validateUserCreation,
};
