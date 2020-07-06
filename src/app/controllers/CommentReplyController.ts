import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Comment from '../models/Comment';

class CommentReplyController {
  async store(req: Request, res: Response) {
    const { parentComment: parentCommentId } = req.body;
    const commentRepo = getRepository(Comment);
    const userId = req.currentUser?.id;

    try {
      const parentComment = await commentRepo.findOne(parentCommentId);
      if (!parentComment) {
        return res.status(400).json({ error: 'Comentário pai inválido.' });
      }

      const comment = commentRepo.create({
        ...req.body,
        parentComment,
        author: userId,
      });
      await commentRepo.save(comment);

      return res.json(comment);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao salvar resposta.' });
    }
  }

  async index(req: Request, res: Response) {
    const { parentCommentId } = req.params;
    const { page = 1 } = req.query;
    const itemsPerPage = 10;
    const commentRepo = getRepository(Comment);

    try {
      const [replies, count] = await commentRepo.findAndCount({
        where: { parentComment: parentCommentId },
        take: itemsPerPage,
        skip: itemsPerPage * (Number(page) - 1),
      });

      return res.json({ count, replies });
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao listar respostas.' });
    }
  }
}

export default new CommentReplyController();
