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
      const user = await repository.findOne({
        where: { email, isActive: true },
      });
      if (!user || !(await user.checkPassword(password))) {
        return res.status(400).json({ error: 'E-mail ou senha incorretos.' });
      }

      if (!user.confirmedEmail) {
        return res.status(403).json({ error: 'O e-mail não foi confirmado.' });
      }

      const { id, name, isAdmin } = user;

      const token = jwt.sign({ id, email, name, isAdmin }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      });

      return res.json({ id, email, token });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Erro ao fazer login.' });
    }
  }
}

export default new LoginController();
