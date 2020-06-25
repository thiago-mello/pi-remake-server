import { Request, Response } from 'express';
import { getRepository, getCustomRepository } from 'typeorm';
import Project from '../models/Project';
import User from '../models/User';
import ProjectRepository from '../models/repositories/ProjectRepository';

class ProjectController {
  async store(req: Request, res: Response) {
    const projectRepo = getRepository(Project);
    const userRepo = getRepository(User);
    const { members: membersIds, managers: managerIds } = req.body;
    let managers;

    try {
      const members = await userRepo.findByIds(membersIds);
      if (!members.length) {
        return res
          .status(400)
          .json({ error: 'Nenhum membro válido selecionado.' });
      }

      if (managerIds) {
        managers = await userRepo.findByIds(managerIds);
      }

      const project = projectRepo.create({
        ...req.body,
        members,
        managers,
      });
      await projectRepo.save(project);

      return res.json(project);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao salvar projeto.' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const projectRepo = getRepository(Project);

      const project = await projectRepo.findOne(id);
      if (!project) {
        return res.status(404).json({ error: 'Projeto não encontrado.' });
      }

      await projectRepo.remove(project);

      return res.json({ id });
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao deletar projeto.' });
    }
  }

  async index(req: Request, res: Response) {
    const projectRepo = getRepository(Project);
    const { page = 1 } = req.query;
    const itemsPerPage = 10;

    try {
      const [projects, count] = await projectRepo.findAndCount({
        take: itemsPerPage,
        skip: itemsPerPage * (Number(page) - 1),
      });

      return res.json({ count, projects });
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao listar porjetos.' });
    }
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    const projectRepo = getCustomRepository(ProjectRepository);

    try {
      const project = await projectRepo.findByPk(id, {
        includeManagers: true,
        includeMembers: true,
      });
      if (!project) {
        return res.status(404).json({ error: 'Projeto não encontrado.' });
      }

      return res.json(project);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Erro ao buscar projeto.' });
    }
  }
}

export default new ProjectController();
