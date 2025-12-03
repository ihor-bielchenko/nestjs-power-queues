import { Inject } from '@nestjs/common';

export const getQueueToken = (name: string) => `QueueService_${name}`;

export const InjectQueue = (name: string) => Inject(getQueueToken(name));
