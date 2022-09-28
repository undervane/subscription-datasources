import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AppType {
  @Field()
  example: string;
}
