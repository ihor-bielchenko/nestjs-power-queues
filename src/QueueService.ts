import { 
	OnModuleInit, 
	OnModuleDestroy, 
} from '@nestjs/common';
import type { IORedisLike } from 'power-redis';
import { PowerQueues } from 'power-queues';
import { RedisService } from 'nestjs-power-redis';

export class QueueService extends PowerQueues implements OnModuleInit, OnModuleDestroy {
	public readonly runOnInit: boolean = false;
	public redis!: IORedisLike;

	constructor(public readonly redisService: RedisService) {
		super();

		this.redis = redisService.redis as IORedisLike;
	}

	queueName(): string {
		return process.env.QUEUE_NAME || String(process.argv[3]);
	}

	async init() {
		if (await this.redisService.checkConnection()) {
			await this.loadScripts(this.runOnInit);
			
			if (this.runOnInit) {
				await this.runQueue(this.queueName());
			}
		}
		else {
			setTimeout(this.init, 5000);
		}
	}

	async onModuleInit() {
		void this.init();
	}

	async onModuleDestroy() {
		if (this.runOnInit) {
			this.abort.abort();
		}
	}
}
