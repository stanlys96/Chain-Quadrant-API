import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { HttpModule } from '@nestjs/axios';
import { CryptoService } from '../crypto/crypto.service';

@Module({
  imports: [HttpModule],
  controllers: [UsersController],
  providers: [UsersService, CryptoService],
})
export class UsersModule {}
