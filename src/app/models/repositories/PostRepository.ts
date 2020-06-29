import { EntityRepository, Repository } from 'typeorm';
import Post from '../Post';

interface IPostsWithCount {
  count: number;
  posts: Post[];
}

@EntityRepository(Post)
export default class PostRepository extends Repository<Post> {
  async listPostsWithAuthors(page = 1): Promise<IPostsWithCount> {
    const itemsPerPage = 10;
    const [posts, count] = await this.createQueryBuilder('posts')
      .leftJoinAndSelect('posts.author', 'author')
      .leftJoinAndSelect('author.team', 'team')
      .select(['posts', 'author.name', 'author.id', 'team.id', 'team.name'])
      .limit(itemsPerPage)
      .offset(itemsPerPage * (page - 1))
      .getManyAndCount();

    return { count, posts };
  }
}
