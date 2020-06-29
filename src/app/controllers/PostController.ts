import { getRepository, getCustomRepository } from 'typeorm';
import { Request, Response } from 'express';
import PostRepository from '../models/repositories/PostRepository';
import Post from '../models/Post';

class PostController {
  async store(req: Request, res: Response) {
    const id = req.currentUser?.id;
    const postRepo = getRepository(Post);

    try {
      const post = postRepo.create({
        ...req.body,
        author: id,
      });

      await postRepo.save(post);
      return res.json(post);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao salvar postagem.' });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const postRepo = getRepository(Post);

    try {
      const post = await postRepo.findOne(id, {
        loadRelationIds: true,
      });
      if (!post) {
        return res.status(404).json({ error: 'Postagem não encontrada.' });
      }
      if (post.author !== req.currentUser?.id && !req.currentUser?.isAdmin) {
        return res
          .status(403)
          .json({ error: 'Você não possui autorização para isso.' });
      }

      postRepo.merge(post, { ...req.body, author: post.author });
      await postRepo.save(post);

      return res.json(post);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao atualizar postagem.' });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const postRepo = getRepository(Post);

    try {
      const post = await postRepo.findOne(id, { loadRelationIds: true });
      if (!post) {
        return res.status(404).json({ error: 'Post não encontrado.' });
      }

      if (post.author !== req.currentUser?.id && !req.currentUser?.isAdmin) {
        return res
          .status(403)
          .json({ error: 'Você não possui autorização para isso.' });
      }

      await postRepo.remove(post);

      return res.json({ id });
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao deletar post.' });
    }
  }

  async index(req: Request, res: Response) {
    const postRepo = getCustomRepository(PostRepository);
    const page = req.query.page ? Number(req.query.page) : 1;

    try {
      const posts = await postRepo.listPostsWithAuthors(page);

      return res.json(posts);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao listar postagens.' });
    }
  }
}

export default new PostController();
