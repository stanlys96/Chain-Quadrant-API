import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ItemsModule } from './items/items.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CryptoService } from './crypto/crypto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';

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
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'junction.proxy.rlwy.net', // Remote database host
      port: 31516, // Default PostgreSQL port
      username: 'postgres', // Database username
      password: 'JxUFsTprLQrbylVMlxfQcHIpMomhktcp', // Database password
      database: 'railway', // Database name
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Entities location
      synchronize: true, // Set to false in production
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [CryptoService],
})
export class AppModule {}
