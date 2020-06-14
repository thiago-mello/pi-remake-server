import 'dotenv/config';
import Queue from './app/services/queue';

Queue.process();
console.log('Background Jobs Queue running.');
