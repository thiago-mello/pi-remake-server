import { EntityRepository, Repository } from 'typeorm';
import Project from '../Project';

@EntityRepository(Project)
export default class ProjectRepository extends Repository<Project> {
  async findByPk(
    id: number | string,
    options?: { includeMembers?: boolean; includeManagers?: boolean },
  ): Promise<Project | undefined> {
    const selectAttributes = ['project'];
    const project = this.createQueryBuilder('project').where(
      'project.id = :id',
      { id },
    );

    if (options?.includeMembers) {
      project
        .leftJoinAndSelect('project.members', 'members')
        .leftJoinAndSelect('members.team', 'team');

      selectAttributes.push(
        'members.id',
        'members.name',
        'members.email',
        'team.id',
        'team.name',
      );
    }

    if (options?.includeManagers) {
      project
        .leftJoinAndSelect('project.managers', 'managers')
        .leftJoinAndSelect('managers.team', 'managerTeam');
      selectAttributes.push(
        'managers.name',
        'managers.id',
        'managers.email',
        'managerTeam.id',
        'managerTeam.name',
      );
    }

    return project.select(selectAttributes).getOne();
  }
}
