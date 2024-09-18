import { Controller, Get, Param } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiOperation({
    summary: "Get a transaction detail from a user's token transfer",
  })
  @Get('/:transactionId')
  fetchItems(@Param('transactionId') transactionId: string): any {
    return this.transactionsService.getTransactionDetails(transactionId);
  }
}
