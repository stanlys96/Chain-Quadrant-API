import { ApiProperty } from '@nestjs/swagger';

export class CreateCurrencyDto {
  @ApiProperty({ description: 'The mintAddress of the currency' })
  mintAddress: string;
}
