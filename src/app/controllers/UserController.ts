import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import User from '../models/User';

class UserController {
  async store(req: Request, res: Response) {
    const repository = getRepository(User);
    const { password, email } = req.body;
    try {
      const emailAlreadyInUse = await repository.findOne({ where: { email } });
      if (emailAlreadyInUse) {
        return res.status(400).json({ error: 'E-mail já está em uso.' });
      }

      const user = repository.create(req.body as User);
      user.password = password;
      const { id, name } = await repository.save(user);

      return res.json({ id, name, email });
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
    }
  }
}

export default new UserController();
