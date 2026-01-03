import { 
	OnModuleInit, 
	OnModuleDestroy, 
	Logger,
} from '@nestjs/common';
import type { IORedisLike } from 'power-redis';
import { PowerQueues } from 'power-queues';
import { RedisService } from 'nestjs-power-redis';
import { isFunc } from 'full-utils';

export class QueueService extends PowerQueues implements OnModuleInit, OnModuleDestroy {
	public readonly logger = new Logger('QueueService');
	public readonly runOnInit: boolean = false;
	public redis!: IORedisLike;

	constructor(public readonly redisService: RedisService) {
		super();

		this.redis = redisService.redis as IORedisLike;
	}

	queueName(): string {
		return process.env.QUEUE_NAME || String(process.argv[3]);
	}

	async onModuleInit() {
		await this.loadScripts(this.runOnInit);
		
		if (this.runOnInit) {
			await this.runQueue(this.queueName());
		}
	}

	async onModuleDestroy() {
		if (this.runOnInit) {
			this.abort.abort();
		}
	}
}
