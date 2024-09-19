import { ApiProperty } from '@nestjs/swagger';

export class CreateCurrencyDto {
  @ApiProperty({ description: 'The mintAddress of the currency' })
  mintAddress: string;
}

export class CreateCurrencyResponseDto {
  @ApiProperty({
    description: 'The unique ID of the currency',
    example: 'cca0fd75-2954-42d4-ae72-0a25b575df6d',
  })
  id: string;

  @ApiProperty({
    description: 'The mintAddress of the currency',
    example: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
  })
  mintAddress: string;

  @ApiProperty({
    description: 'The mintAddress of the currency',
    example: 'SOL',
  })
  name: string;

  @ApiProperty({
    description: 'The mintAddress of the currency',
    example: 'SOL',
  })
  symbol: string;
}
