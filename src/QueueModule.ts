import { 
	DynamicModule, 
	Module, 
} from '@nestjs/common';
import {
	RedisModule,
	RedisService,
	getRedisToken,
} from 'nestjs-power-redis';
import { QueueService } from './QueueService';
import { getQueueToken } from './InjectQueue';

@Module({})
export class QueueModule {
	static forRoot(names: string[]): DynamicModule {
		const queueProviders = names.map((name) => ({
			provide: getQueueToken(name),
			useFactory: (redisService: RedisService) => {
				return new QueueService(redisService);
			},
			inject: [ getRedisToken(name) ],
		}));

		return {
			module: QueueModule,
			imports: [
				RedisModule.forRoot(names),
			],
			providers: [
				...queueProviders,
			],
			exports: [
				...queueProviders,
				RedisModule,
			],
		};
	}
}
