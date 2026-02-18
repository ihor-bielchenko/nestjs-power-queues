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
REDIS_QUEUES_DATABASE=1
REDIS_QUEUES_PASSWORD=
REDIS_QUEUES_KEY_EXPIRE=300
REDIS_QUEUES_TLS_CA_CRT=
REDIS_QUEUES_TLS_KEY=
REDIS_QUEUES_TLS_CRT=
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
    await this.queueService.addTasks('example:job', [ ...payload ]);
  }
}
```

### 4. Example of a worker for executing a MySQL insert transaction

```ts
import { Injectable } from '@nestjs/common';
import {
  InjectRedis,
  RedisService,
} from 'nestjs-power-redis';
import { 
  QueueService,
  Task, 
} from 'nestjs-power-queues';
import { 
  isArrFilled,
  isObjFilled,
} from 'full-utils';
import { MysqlService } from 'mysql';
import { Logger } from '../logger';

@Injectable()
export class ExampleQueue extends QueueService {
  public readonly logger: Logger = new Logger(ExampleQueue.name);
  public readonly selectStuckCount: number = 256;
  public readonly selectCount: number = 256;
  public readonly retryCount: number = 3;
  public readonly runOnInit: boolean = true;
  public readonly executeSync: boolean = true;
  public readonly removeOnExecuted: boolean = true;

  constructor(
    @InjectRedis('queues') public readonly redisService: RedisService,
    public readonly mysqlService: MysqlService,
  ) {
    super(redisService);
  }

  queueName(): string {
    return 'mysql_create:example:table_name';
  }

  async onBatchReady(queueName: string, tasks: Task[]) {
    const values = tasks
      .filter((task) => isObjFilled(task.payload))
      .map((task) => task.payload);

    if (isArrFilled(values)) {
      const queryRunner = this.mysqlService.connection('database_name').createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        await queryRunner
          .manager
          .createQueryBuilder()
          .insert()
          .into('table_name')
          .values(values)
          .execute();
        await queryRunner.commitTransaction();
      }
      catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
      }
      finally {
        await queryRunner.release();
      }
    }
  }

  async onBatchError(err: any, queueName: string, tasks: Array<[ string, any, number, string, string, number ]>) {
    this.logger.error('Transaction error', queueName, tasks.length, (process.env.NODE_ENV === 'production')
      ? err.message
      : err, tasks.map((task) => task[1]));
  }
}
```

The `runOnInit` parameter determines whether queue processing should start immediately after the application starts.

## 📜 License
MIT - free for commercial and private use.
