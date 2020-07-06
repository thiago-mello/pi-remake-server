import * as yup from 'yup';
import { Request, Response, NextFunction } from 'express';

async function validateProject(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> {
  const rules = yup.object().shape({
    name: yup.string().required(),
    value: yup.number().min(0).required(),
    members: yup
      .array()
      .of(yup.number().integer().min(1).required())
      .required(),
    managers: yup.array().of(yup.number().integer().min(1)),
    signatureDate: yup.date().required(),
    deadline: yup.number().integer().min(0),
  });

  try {
    await rules.validate(req.body);
    return next();
  } catch (err) {
    return res.status(400).json({ error: 'Dados inválidos.' });
  }
}

export default { validateProject };
