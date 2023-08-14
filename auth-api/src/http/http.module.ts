import { Module } from '@nestjs/common';
import { HttpModule as NestHttpModule } from '@nestjs/axios';

@Module({
  imports: [NestHttpModule],
  exports: [NestHttpModule],
})
export class HttpModule {}
