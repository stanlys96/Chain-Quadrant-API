import { ApiProperty } from '@nestjs/swagger';
import { FullItemDto } from 'src/commonDto/meta.dto';

interface StatusDto {
  status: string;
}

export class TransactionDetailResponseDto {
  @ApiProperty({
    description: 'The unique ID of the transaction',
    example: 'fca54f7e-4f9d-4f05-8b16-85b5d7689552',
  })
  id: string;

  @ApiProperty({
    description: 'The time this transaction was created',
    example: '2024-09-19T05:08:06.134Z',
  })
  created: string;

  @ApiProperty({
    description: 'The status of the transaction',
    example: {
      status: 'Pending',
    },
  })
  status: StatusDto;

  @ApiProperty({
    description: 'The details of the transaction',
    example: {
      type: 'TransferToken',
      item: {
        id: 'SOL',
        mintAddress: '11111111111111111111111111111111',
        name: 'SOL',
        symbol: 'SOL',
      },
    },
  })
  details: FullItemDto;
}
