import { getRepository } from 'typeorm';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import User from '../models/User';
import authConfig from '../../config/auth';

class LoginController {
  async store(req: Request, res: Response) {
    const { email, password } = req.body;
    const repository = getRepository(User);

    try {
      const user = await repository.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ error: 'E-mail ou senha incorretos.' });
      }

      if (!(await user.checkPassword(password))) {
        return res.status(400).json({ error: 'E-mail ou senha incorretos.' });
      }

      const { id, name, isAdmin } = user;

      const token = jwt.sign({ id, email, name, isAdmin }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      });

      return res.json({ id, email, token });
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao fazer login.' });
    }
  }
}

export default new LoginController();
