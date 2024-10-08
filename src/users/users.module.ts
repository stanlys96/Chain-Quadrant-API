import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { HttpModule } from '@nestjs/axios';
import { CryptoService } from '../crypto/crypto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Transaction } from './entities/transaction.entity';
import { Airdrop } from './entities/airdrop.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([User, Transaction, Airdrop])],
  controllers: [UsersController],
  providers: [UsersService, CryptoService],
})
export class UsersModule {}
