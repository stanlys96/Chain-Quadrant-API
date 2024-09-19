import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateCurrencyDto, CreateCurrencyResponseDto } from './currencies.dto';

@ApiTags('Currencies')
@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @ApiOperation({ summary: 'Register a currency' })
  @Post('/import')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the item details that have been registered',
    type: CreateCurrencyResponseDto,
  })
  fetchItems(@Body() body: CreateCurrencyDto): any {
    const { mintAddress } = body;
    return this.currenciesService.importCurrency(mintAddress);
  }
}
