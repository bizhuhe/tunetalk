import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [],
  providers: [JwtService]
})
export class AuthModule {}