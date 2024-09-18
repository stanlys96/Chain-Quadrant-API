import { Controller, Post, Body } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateCurrencyDto } from './currencies.dto';

@ApiTags('Currencies')
@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @ApiOperation({ summary: 'Register a currency' })
  @Post('/import')
  fetchItems(@Body() body: CreateCurrencyDto): any {
    const { mintAddress } = body;
    return this.currenciesService.importCurrency(mintAddress);
  }
}
