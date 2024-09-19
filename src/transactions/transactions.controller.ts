import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TransactionDetailResponseDto } from './transactions.dto';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiOperation({
    summary: "Get a transaction detail from a user's token transfer",
  })
  @Get('/:transactionId')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the transaction details',
    type: TransactionDetailResponseDto,
  })
  fetchItems(@Param('transactionId') transactionId: string): any {
    return this.transactionsService.getTransactionDetails(transactionId);
  }
}
