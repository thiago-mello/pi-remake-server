import { Request, Response } from 'express';
import { getRepository, getManager } from 'typeorm';
import crypto from 'crypto';

import User from '../models/User';
import Team from '../models/Team';
import Token from '../models/Token';
import Queue from '../services/queue';

class UserController {
  async store(req: Request, res: Response) {
    const repository = getRepository(User);
    const tokenRepo = getRepository(Token);

    const { password, email, team } = req.body;
    try {
      const emailAlreadyInUse = await repository.findOne({ where: { email } });
      if (emailAlreadyInUse) {
        return res.status(400).json({ error: 'E-mail já em uso.' });
      }

      const userTeam = await getRepository(Team).findOne(team);
      if (!userTeam) {
        return res.status(400).json({ error: 'Time inválido.' });
      }

      await getManager().transaction(async (transactionManager) => {
        const user = repository.create(req.body as User);
        user.isAdmin = false;
        user.password = password;
        user.confirmedEmail = false;
        const { id, name } = await transactionManager.save(user);

        const tokenValue = crypto.randomBytes(48).toString('hex');
        const token = tokenRepo.create({
          type: 'confirmation',
          token: tokenValue,
          user: user,
        });
        await transactionManager.save(token);

        if (process.env.NODE_ENV === 'production') {
          Queue.add('sendConfirmationEmail', {
            email,
            token: tokenValue,
            name,
          });
        }
        return res.json({ id, name, email, team });
      });
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
    }
  }
}

export default new UserController();
