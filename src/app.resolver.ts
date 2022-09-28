import { Injectable } from '@nestjs/common';
import { Context, Query, Resolver, Subscription } from '@nestjs/graphql';
import { AppService } from './app.service';
import { AppType } from './app.type';

@Injectable()
@Resolver()
export class AppResolver {
  constructor(private readonly service: AppService) {}

  @Query(() => Boolean)
  required(@Context() context) {
    console.log('Datasources:');
    console.log(context.dataSources);
    return true;
  }

  @Subscription(() => AppType, {
    resolve(payload, args, context) {
      console.log('Datasources:');
      console.log(context.dataSources);
      return payload;
    },
  })
  triggerListen() {
    return this.service.listen('example');
  }
}
