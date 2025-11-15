import { 
	DynamicModule, 
	Module, 
} from '@nestjs/common';
import { 
	redisRoot,
	RedisService, 
} from 'nestjs-power-redis';
import { QueueService } from './QueueService';

@Module({})
export class QueueModule {
	static forRoot(names: string[]): DynamicModule {
		return {
			module: QueueModule,
			imports: [
				...redisRoot(names),
			],
			providers: [
				RedisService,
				QueueService,
			],
			exports: [
				RedisService,
				QueueService,
			],
		};
	}
}
