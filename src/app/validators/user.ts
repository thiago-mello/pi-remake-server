import * as yup from 'yup';
import cpf from 'cpf';
import { subYears } from 'date-fns';
import { Request, Response, NextFunction } from 'express';

const phoneRegex = /(\(?\d{2}\)?\s)?(\d{4,5}\-\d{4})/;

async function validateUserCreation(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> {
  const rules = yup.object().shape({
    name: yup.string().max(255).required(),
    email: yup
      .string()
      .email()
      .matches(/@elojr.com.br$/)
      .required(),
    team: yup.number().min(1).required(),
    birthDate: yup.date().required().max(subYears(new Date(), 18)),
    course: yup.string().required(),
    startDate: yup.date().max(new Date()).required(),
    postalCode: yup.string().length(8).required(),
    address: yup.string().required(),
    phone: yup.string().required().matches(phoneRegex),
    cpf: yup
      .string()
      .required()
      .test('cpf_validation', 'The cpf must be valid.', cpf.isValid),
    rg: yup.string().required(),
  });

  try {
    await rules.validate(req.body);
    return next();
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'Dados Inválidos' });
  }
}

async function validateUserRegistration(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> {
  const rules = yup.object().shape({
    name: yup.string().max(255).required(),
    email: yup
      .string()
      .email()
      .matches(/@elojr.com.br$/)
      .required(),
    team: yup.number().min(1).required(),
    birthDate: yup.date().required().max(subYears(new Date(), 18)),
    course: yup.string().required(),
    startDate: yup.date().max(new Date()).required(),
    postalCode: yup.string().length(8).required(),
    address: yup.string().required(),
    phone: yup.string().required().matches(phoneRegex),
    cpf: yup
      .string()
      .required()
      .test('cpf_validation', 'The cpf must be valid.', cpf.isValid),
    rg: yup.string().required(),
    password: yup.string().required().min(8),
    passwordConfirm: yup.string().oneOf([yup.ref('password')]),
  });

  try {
    await rules.validate(req.body);
    return next();
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'Dados Inválidos' });
  }
}

async function validatePasswordRegistration(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> {
  const rules = yup.object().shape({
    email: yup
      .string()
      .email()
      .matches(/@elojr.com.br$/)
      .required(),
    password: yup.string().required().min(8),
    passwordConfirm: yup.string().oneOf([yup.ref('password')]),
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
  validateUserRegistration,
  validatePasswordRegistration,
};
