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
}

export default new UserController();
