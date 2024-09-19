import { ApiProperty } from '@nestjs/swagger';
import { FullItemDto, MetaDto } from 'src/commonDto/meta.dto';

export class AllItemsDto {
  @ApiProperty({
    description: 'Reference ID and email of all users that have registered',
    example: [
      {
        type: 'Currency',
        item: {
          id: 'SOL',
          mintAddress: '11111111111111111111111111111111',
          name: 'SOL',
          symbol: 'SOL',
        },
      },
      {
        type: 'Currency',
        item: {
          id: 'USDC',
          mintAddress: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
          name: 'USD Coin',
          symbol: 'USDC',
        },
      },
    ],
  })
  data: FullItemDto[];

  @ApiProperty({
    description: 'Meta for pagination',
    example: {
      page: 1,
      perPage: 50,
      totalPages: 1,
    },
  })
  meta: MetaDto;
}
