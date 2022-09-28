import { Inject, Injectable } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';

@Injectable()
export class AppService {
  constructor(@Inject(RedisPubSub) private readonly pubSub: RedisPubSub) {}

  public async listen(eventName: string) {
    return this.pubSub.asyncIterator(eventName);
  }

  public async publish<Payload>(eventName: string, payload: Payload) {
    await this.pubSub.publish(eventName, {
      [eventName]: payload,
    });

    return payload;
  }
}
