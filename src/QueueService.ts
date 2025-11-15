import { 
	Injectable,
	OnModuleInit, 
	OnModuleDestroy, 
	Logger,
} from '@nestjs/common';
import type { IORedisLike } from 'power-redis';
import { PowerQueues } from 'power-queues';
import { RedisService } from 'nestjs-power-redis';
import { isFunc } from 'full-utils';

@Injectable()
export class QueueService extends PowerQueues implements OnModuleInit, OnModuleDestroy {
	public readonly logger: Logger = new Logger('QueueService');
	public readonly runOnInit: boolean = false;
	public redis!: IORedisLike;
	public abort = new AbortController();

	constructor(
		public readonly redisService: RedisService,
	) {
		super();
	}

	async onModuleInit() {
		this.redis = this.redisService.redis;

		await this.loadScripts(this.runOnInit);
		
		if (this.runOnInit) {
			await this.runQueue();
		}
	}

	async onModuleDestroy() {
		if (this.runOnInit) {
			this.abort.abort();
		}
	}
}