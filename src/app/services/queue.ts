import Queue, { JobOptions, Job } from 'bull';
import jobs from '../jobs';
import redisConfig from '../../config/redisConfig';

const queues = jobs.map(
  (job: {
    name: string;
    handle: (data: Job) => Promise<void>;
    options?: JobOptions;
  }) => ({
    instance: new Queue(job.name, { redis: redisConfig }),
    name: job.name,
    handle: job.handle,
    options: job?.options,
  }),
);

export default {
  queues,
  async add(jobName: string, data: any): Promise<void> {
    const queue = queues.find((queue) => queue.name === jobName);
    await queue?.instance.add(data, queue.options);
  },
  process(): void {
    queues.forEach((queue) => queue.instance.process(queue.handle));
  },
};
