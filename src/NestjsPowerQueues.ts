import { 
	Injectable,
	OnModuleInit, 
	OnModuleDestroy, 
	Logger,
} from '@nestjs/common';
import type { IORedisLike } from 'power-redis';
import { PowerQueues } from 'power-queues';
import { NestjsPowerRedis } from 'nestjs-power-redis';
import { isFunc } from 'full-utils';

@Injectable()
export class NestjsPowerQueues extends PowerQueues implements OnModuleInit, OnModuleDestroy {
	public readonly logger: Logger = new Logger('NestjsPowerQueues');
	public readonly runOnInit: boolean = false;
	public abort: any;

	constructor(
		public readonly redis: NestjsPowerRedis,
	) {
		super();
	}

	async onModuleInit() {
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