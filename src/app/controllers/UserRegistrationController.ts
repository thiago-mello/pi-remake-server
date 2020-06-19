import crypto from 'crypto';
import { Request, Response } from 'express';
import { getRepository, getManager } from 'typeorm';
import User from '../models/User';
import Token from '../models/Token';
import Team from '../models/Team';
import Queue from '../services/queue';

class UserRegistrationController {
  async store(req: Request, res: Response) {
    const userRepository = getRepository(User);
    const teamRepository = getRepository(Team);
    const tokenRepository = getRepository(Token);

    const { email, password, team } = req.body;

    try {
      const emailAlreadyInUse = await userRepository.findOne({
        where: { email },
      });
      if (emailAlreadyInUse) {
        return res.status(400).json({ error: 'E-mail já em uso.' });
      }

      const userTeam = await teamRepository.findOne(team);
      if (!userTeam) {
        return res.status(400).json({ error: 'Núcleo inválido.' });
      }

      await getManager().transaction(async (transactionManager) => {
        const user = userRepository.create({
          ...(req.body as User),
          isAdmin: false,
          isActive: true,
          confirmedEmail: false,
        });
        user.password = password;
        const { id, name } = await transactionManager.save(user);

        const tokenValue = crypto.randomBytes(48).toString('hex');
        const token = tokenRepository.create({
          token: tokenValue,
          type: 'confirmation',
          user: user,
        });
        await transactionManager.save(token);

        if (process.env.NODE_ENV === 'production') {
          await Queue.add('sendConfirmationEmail', {
            email,
            token: tokenValue,
            name,
          });
        }

        return res.json({ id, name, email, team });
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
    }
  }

  async show(req: Request, res: Response) {
    const { email } = req.query;
    const userRepository = getRepository(User);

    try {
      const user = await userRepository.findOne({ where: { email } });
      if (!user) {
        return res.json({ isRegistered: false, isUser: false });
      }

      if (!user.hasPassword()) {
        return res.json({ isRegistered: true, isUser: false });
      }

      return res.json({ isRegistered: true, isUser: true });
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao verificar usuário.' });
    }
  }

  async update(req: Request, res: Response) {
    const { email, password } = req.body;
    const userRepository = getRepository(User);
    const tokenRepository = getRepository(Token);

    try {
      const user = await userRepository.findOne({ where: { email } });
      if (!user || user.hasPassword()) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      await getManager().transaction(async (transactionManager) => {
        user.password = password;
        await user.hashPassword();
        await transactionManager.save(user);

        const tokenValue = crypto.randomBytes(48).toString('hex');
        const token = tokenRepository.create({
          token: tokenValue,
          type: 'confirmation',
          user: user,
        });

        if (process.env.NODE_ENV === 'production') {
          await Queue.add('sendConfirmationEmail', {
            email,
            token: tokenValue,
            name: user.name,
          });
        }
        await transactionManager.save(token);
      });

      return res.json({ id: user.id, email, name: user.name });
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao registrar usuário.' });
    }
  }
}

export default new UserRegistrationController();
