import { Controller, Get, Param } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('/:transactionId')
  fetchItems(@Param('transactionId') transactionId: string): any {
    return this.transactionsService.getTransactionDetails(transactionId);
  }
}
