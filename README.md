# nestjs-power-queues — Secure, Scalable & Production‑Ready power-queues Integration for NestJS

This module is a **dedicated, production-ready NestJS wrapper around `power-queues`** — a high‑performance Redis abstraction layer for Node.js.

It is a **structured, type-safe, and feature-rich integration** designed specifically to bring all the power of `power-queues` into the NestJS ecosystem with zero friction.

<p align="center">
  <img src="https://img.shields.io/badge/redis-streams-red?logo=redis" />
  <img src="https://img.shields.io/badge/nodejs-queue-green?logo=node.js" />
  <img src="https://img.shields.io/badge/typescript-ready-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/license-MIT-lightgrey" />
  <img src="https://img.shields.io/badge/nestjs-support-ea2845?logo=nestjs" />
  <img src="https://img.shields.io/badge/status-production-success" />
</p>

---

## 📚 Documentation

Full documentation is available here:  
👉 **https://nestjs-power-queues.docs.ihor.bielchenko.com**

---

# 📦 Installation

``` bash
npm install nestjs-power-queues
```
OR
```bash
yarn add nestjs-power-queues
```
---

# 🧪 Quick Start Example

## For example, you need to specify 2 connections: `queues1` and `queues2`

### 1. 🔐 Environment Variables (power-redis -Friendly)

Everything is configured using environment variables:

```env
REDIS_<NAME>_HOST=127.0.0.1
REDIS_<NAME>_PORT=6379
REDIS_<NAME>_PASSWORD=pass
REDIS_<NAME>_DATABASE=0

# TLS
REDIS_<NAME>_TLS_CRT=/etc/ssl/client.crt
REDIS_<NAME>_TLS_KEY=/etc/ssl/client.key
REDIS_<NAME>_TLS_CA_CRT=/etc/ssl/ca.crt
```

Instead of `<NAME>` you need to specify a custom connection name and then specify these names in `QueueModule.forRoot` (allowed in lowercase).
For example:

```env
REDIS_QUEUES1_HOST=127.0.0.1
REDIS_QUEUES1_PORT=6379
REDIS_QUEUES1_PASSWORD=
REDIS_QUEUES1_DATABASE=0

REDIS_QUEUES2_HOST=127.0.0.1
REDIS_QUEUES2_PORT=6379
REDIS_QUEUES2_PASSWORD=
REDIS_QUEUES2_DATABASE=0
```

TLS fields are optional.

---

### 2. Register module with multiple Redis clients

```ts
import { QueueModule } from 'nestjs-power-queues';

@Module({
  imports: [
    QueueModule.forRoot([ 'queues1', 'queues2' ]),
  ],
})
export class AppModule {}
```

---

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
    @InjectQueue('queues1') private readonly queueService1: QueueService,
    @InjectQueue('queues2') private readonly queueService2: QueueService,
  ) {}

  async test() {
    await this.queueService1.addTasks('example:jobs', [
      { payload },
    ]);
  }
}
```

### 3. Create job processor

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
    @InjectRedis('queues1') public readonly redisService: RedisService,
  ) {}

  async onExecute(id, payload) {
  	// business-logic
  }
}
```

The `runOnInit` parameter determines whether queue processing should start immediately after the application starts.

---

## 🏗️ How It Works Internally

### queueRoot()
Loads all Redis configurations based on environment variables, applies TLS if present, and sets reconnection strategies.

### QueueModule.forRoot()
Creates dynamic providers for each Redis connection:
```
RedisQueue_queues1  
RedisQueue_queues2
```

These providers are available through:
```ts
@InjectQueue('queues1')
@InjectQueue('queues2')
```

---

## 📜 License

MIT - free for commercial and private use.