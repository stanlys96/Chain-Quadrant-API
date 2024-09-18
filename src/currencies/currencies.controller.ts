import { Controller, Post, Body } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Currencies')
@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Post('/import')
  fetchItems(@Body() body): any {
    const { mintAddress } = body;
    return this.currenciesService.importCurrency(mintAddress);
  }
}
