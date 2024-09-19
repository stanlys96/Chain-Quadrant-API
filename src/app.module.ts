import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ItemsModule } from './items/items.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CryptoService } from './crypto/crypto.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true, // Makes the config module available globally
    }),
    UsersModule,
    ItemsModule,
    CurrenciesModule,
    TransactionsModule,
  ],
  providers: [CryptoService],
})
export class AppModule {}
