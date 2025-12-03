# nestjs-power-queues

## power-queues integration for NestJS

<p align="center">
	<img src="https://img.shields.io/badge/redis-streams-red?logo=redis" />
	<img src="https://img.shields.io/badge/nodejs-queue-green?logo=node.js" />
	<img src="https://img.shields.io/badge/typescript-ready-blue?logo=typescript" />
	<img src="https://img.shields.io/badge/license-MIT-lightgrey" />
	<img src="https://img.shields.io/badge/nestjs-support-ea2845?logo=nestjs" />
	<img src="https://img.shields.io/badge/status-production-success" />
</p>

## 📚 Documentation
Full documentation is available here:  
👉 **https://nestjs-power-queues.docs.ihor.bielchenko.com**

## 📦 Installation

``` bash
npm install nestjs-power-queues
```
OR
```bash
yarn add nestjs-power-queues
```

## 🧪 Basic usage

### 1. Connection settings are specified in the .env file:
```env
REDIS_QUEUES_HOST=127.0.0.1
REDIS_QUEUES_PORT=6379
REDIS_QUEUES_PASSWORD=
REDIS_QUEUES_DATABASE=0
```

For information on creating connections to Redis, see **[nestjs-power-redis](https://www.npmjs.com/package/nestjs-power-redis)**

### 2. Register module with multiple Redis clients

```ts
import { QueueModule } from 'nestjs-power-queues';

@Module({
  imports: [
    QueueModule.forRoot([ 'queues' ]),
  ],
})
export class AppModule {}
```

### 3. Inject in a service

```ts
import { Injectable } from '@nestjs/common';
import { 
	InjectQueue,
	QueueService, 
} from 'nestjs-power-queues';

@Injectable()
export class MyService {
  constructor(
    @InjectQueue('queues') private readonly queueService: QueueService,
  ) {}

  async test() {
    await this.queueService.addTasks('example:jobs', [
      { payload },
    ]);
  }
}
```

### 4. Create worker

```ts
import { Injectable } from '@nestjs/common';
import { 
	InjectRedis,
	RedisService, 
} from 'nestjs-power-redis';
import { QueueService } from 'nestjs-power-queues';

@Injectable()
export class MyService extends QueueService {
  public readonly stream: string = `example:jobs`;
  public readonly workerBatchTasksCount: number = 8192;
  public readonly runOnInit: boolean = true;
  public readonly executeBatchAtOnce: boolean = true;

  constructor(
    @InjectRedis('queues') public readonly redisService: RedisService,
  ) {}

  async onExecute(id, payload) {
  	// business-logic
  }
}
```

The `runOnInit` parameter determines whether queue processing should start immediately after the application starts.

## 📜 License
MIT - free for commercial and private use.
