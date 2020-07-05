import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Comment from '../models/Comment';
import Post from '../models/Post';

class CommentController {
  async store(req: Request, res: Response) {
    const commentRepo = getRepository(Comment);
    const postRepo = getRepository(Post);
    const userId = req.currentUser?.id;

    const { post: postId } = req.body;

    try {
      const post = await postRepo.findOne(postId);
      if (!post) {
        return res.status(400).json({ error: 'Post inválido.' });
      }

      const comment = commentRepo.create({
        ...req.body,
        author: userId,
        parentComment: null,
      });
      await commentRepo.save(comment);

      return res.json(comment);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao salvar comentário.' });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const commentRepo = getRepository(Comment);
    const { content } = req.body;

    try {
      const comment = await commentRepo.findOne(id, { loadRelationIds: true });
      if (!comment) {
        return res.status(404).json({ error: 'Comentário não encontrado.' });
      }

      if (comment.author !== req.currentUser?.id) {
        return res
          .status(403)
          .json({ error: 'Você não possui permissão para isso.' });
      }

      commentRepo.merge(comment, { content });
      await commentRepo.save(comment);

      return res.json(comment);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao atualizar comentário.' });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const commentRepo = getRepository(Comment);

    try {
      const comment = await commentRepo.findOne(id, {
        loadRelationIds: true,
      });
      if (!comment) {
        return res.status(404).json({ error: 'Comentário não encontrado.' });
      }

      if (comment.author !== req.currentUser?.id && !req.currentUser?.isAdmin) {
        return res
          .status(403)
          .json({ error: 'Você não possui auttorização para isso.' });
      }

      await commentRepo.remove(comment);

      return res.json({ id });
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao deletar comentário.' });
    }
  }
}

export default new CommentController();
