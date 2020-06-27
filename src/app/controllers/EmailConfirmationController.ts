import crypto from 'crypto';
import { getRepository, getManager } from 'typeorm';
import { Request, Response } from 'express';
import Token from '../models/Token';
import User from '../models/User';

class EmailConfirmationController {
  async update(req: Request, res: Response) {
    const tokenRepo = getRepository(Token);
    const userRepo = getRepository(User);
    const { token: tokenValue } = req.body;

    const tokenHash = crypto
      .createHash('sha256')
      .update(tokenValue)
      .digest('hex');
    const token = await tokenRepo.findOne({
      where: { token: tokenHash, type: 'confirmation' },
      loadRelationIds: true,
    });
    if (!token) {
      return res.status(400).json({ error: 'Link inválido.' });
    }

    const user = await userRepo.findOne(Number(token.user));
    if (!user) {
      await tokenRepo.remove(token);
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    user.confirmedEmail = true;

    await getManager().transaction(async (transactionManager) => {
      await transactionManager.save(user);
      await transactionManager.remove(token);
    });

    return res.json({
      id: user.id,
      email: user.email,
      confirmedEmail: user.confirmedEmail,
    });
  }
}

export default new EmailConfirmationController();
