import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import User from '../models/User';
import Team from '../models/Team';

class UserController {
  async store(req: Request, res: Response) {
    const repository = getRepository(User);

    const isAdmin = req.currentUser?.isAdmin;
    if (!isAdmin) {
      return res
        .status(403)
        .json({ error: 'Você não tem autorização para isso.' });
    }

    const { email, team } = req.body;
    try {
      const emailAlreadyInUse = await repository.findOne({ where: { email } });
      if (emailAlreadyInUse) {
        return res.status(400).json({ error: 'E-mail já em uso.' });
      }

      const userTeam = await getRepository(Team).findOne(team);
      if (!userTeam) {
        return res.status(400).json({ error: 'Núcleo inválido.' });
      }

      const user = repository.create({
        ...(req.body as User),
        isAdmin: false,
        password: undefined,
        confirmedEmail: false,
      });

      const { id, name } = await repository.save(user);

      return res.json({ id, name, email, team });
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const userRepo = getRepository(User);
    const teamRepo = getRepository(Team);

    if (req.currentUser?.id !== Number(id) && !req.currentUser?.isAdmin) {
      return res
        .status(403)
        .json({ error: 'Você não possui autorização para isso.' });
    }

    try {
      const { team: teamId, email, password, oldPassword } = req.body;
      const team = await teamRepo.findOne(teamId);
      if (!team) {
        return res.status(404).json({ error: 'Núcleo inválido.' });
      }

      const user = await userRepo.findOne(id);
      if (!user) {
        return res.status(404).json({ error: 'Membro não encontrado' });
      }

      if (email && user.email !== email) {
        const userAlreadyExists = await userRepo.findOne({
          where: { email },
        });

        if (userAlreadyExists) {
          return res.status(400).json({ error: 'Este e-mail já está em uso.' });
        }
      }

      userRepo.merge(user, {
        ...req.body,
        team,
        isAdmin: user.isAdmin,
        confirmedEmail: user.confirmedEmail,
      });

      if (req.currentUser?.id === Number(id)) {
        if (!oldPassword || !(await user.checkPassword(oldPassword))) {
          return res.status(403).json({ error: 'Senha incorreta' });
        }

        if (password) {
          user.password = password;
          await user.hashPassword();
        }
      }

      await userRepo.save(user);
      const { name, createdAt, updatedAt } = user;
      return res.json({
        id,
        name,
        email,
        team,
        createdAt,
        updatedAt,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Erro ao atualizar membro.' });
    }
  }
}

export default new UserController();
