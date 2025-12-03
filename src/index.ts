import { redisRoot as queueRoot } from 'nestjs-power-redis';
import {
	getQueueToken,
	InjectQueue,
} from './InjectQueue';
import { QueueModule } from './QueueModule';
import { QueueService } from './QueueService';

export {
	queueRoot,
	getQueueToken,
	InjectQueue,
	QueueModule,
	QueueService,
};
