import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { FactoryProvider, Module, Scope } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Context } from 'graphql-ws';
import Redis from 'ioredis';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { getRedisConnectionConfigs } from './config/redis.config';
import { join } from 'path';
import { AppResolver } from './app.resolver';
import { LiveBlogDataSource } from './user.datasource';

export const PubSubFactory: FactoryProvider = {
  scope: Scope.DEFAULT,
  provide: RedisPubSub,
  useFactory: () => {
    const options = {
      ...getRedisConnectionConfigs(),
      retryStrategy: (times: number) => {
        return Math.min(times * 50, 2000);
      },
    };

    return new RedisPubSub({
      publisher: new Redis(options),
      subscriber: new Redis(options),
    });
  },
};

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      dataSources: () => {
        return {
          gatewayApi: new LiveBlogDataSource(''),
        };
      },
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req, res, payload, connection }) => ({
        req,
        res,
        payload,
        connection,
      }),
      playground: false,
      introspection: true,
      cors: false,
      subscriptions: {
        'graphql-ws': {
          onConnect: (context: Context): boolean => {
            const { connectionParams } = context;
            if (!connectionParams) return false;
            return true;
          },
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppResolver, AppService, PubSubFactory],
})
export class AppModule {}
