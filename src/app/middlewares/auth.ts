import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';

interface JwtPayload {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
}

async function verifyAuthToken(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | any> {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: 'Token não encontrado' });
  }

  const [, token] = authorization.split(' ');

  try {
    const payload = jwt.verify(token, authConfig.secret) as JwtPayload;

    req.currentUser = {
      id: payload.id,
      isAdmin: payload.isAdmin,
      name: payload.name,
      email: payload.email,
    };
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido.' });
  }
}

export default verifyAuthToken;
