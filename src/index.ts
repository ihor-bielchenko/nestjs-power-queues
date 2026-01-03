import { redisRoot as queueRoot } from 'nestjs-power-redis';
import {
	getQueueToken,
	InjectQueue,
} from './InjectQueue';
import { QueueModule } from './QueueModule';
import { QueueService } from './QueueService';

export * from 'power-queues';
export {
	queueRoot,
	getQueueToken,
	InjectQueue,
	QueueModule,
	QueueService,
};
