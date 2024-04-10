import { Module } from '@nestjs/common';
import { DynamooseService } from './dynamoose.service';
import { DynamooseController } from './dynamoose.controller';

@Module({
  providers: [DynamooseService],
  controllers: [DynamooseController]
})
export class DynamooseModule {}
