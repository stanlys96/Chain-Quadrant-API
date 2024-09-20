import { ApiProperty } from '@nestjs/swagger';
import { ItemDto, MetaDto } from 'src/commonDto/meta.dto';

interface UserDto {
  referenceId: string;
  email: string;
}

export class CreateUserDto {
  @ApiProperty({ description: 'The referenceId of the user' })
  referenceId: string;

  @ApiProperty({ description: 'The email of the user' })
  email: string;
}

export class TransferItemDto {
  @ApiProperty({ description: 'The referenceId of the user destination' })
  destinationUserReferenceId: string;

  @ApiProperty({ description: 'The quantity you want to send' })
  quantity: string;
}

export class AllUsersDto {
  @ApiProperty({
    description: 'Reference ID and email of all users that have registered',
    example: [
      {
        referenceId: 'stanly.coding@gmail.com',
        email: 'stanly.coding@gmail.com',
      },
      {
        referenceId: 'asdjkl@gmail.com',
        email: 'asdjkl@gmail.com',
      },
    ],
  })
  data: UserDto[];

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

export class UserRegisterDto {
  @ApiProperty({
    description: 'The referenceId of the user',
    example: 'walaoeh@gmail.com',
  })
  referenceId: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'walaoeh@gmail.com',
  })
  email: string;
}

export class UserWalletDto {
  @ApiProperty({
    description: 'The address of the user',
    example: 'D2qJcVL9DV8ZnjULDhXAQnaKJhRkbYCtcemJPpuuP1Gu',
  })
  address: string;

  @ApiProperty({
    description: 'The wallet provider',
    example: 'GameShift',
  })
  walletProvider: string;
}

export class UserItemDto {
  @ApiProperty({
    description: 'The type of the item',
    example: 'Currency',
  })
  type: string;

  @ApiProperty({
    description: 'The item details',
    example: {
      id: 'SOL',
      mintAddress: '11111111111111111111111111111111',
      name: 'SOL',
      symbol: 'SOL',
    },
  })
  item: ItemDto;

  @ApiProperty({
    description: 'The quantity of the item',
    example: '0.505',
  })
  quantity: string;
}

export class UserTransferDto {
  @ApiProperty({
    description: 'The transaction ID',
    example: 'fca54f7e-4f9d-4f05-8b16-85b5d7689552',
  })
  transactionId: string;

  @ApiProperty({
    description: 'The url to finish the transaction',
    example:
      'https://app.gameshift.dev/consent?transaction=fca54f7e-4f9d-4f05-8b16-85b5d7689552',
  })
  consentUrl: string;
}

export class CreateSolanaAddressDto {
  @ApiProperty({
    description: 'The public key of the wallet address',
    example: 'fca54f7e-4f9d-4f05-8b16-85b5d7689552',
  })
  publicKey: string;

  @ApiProperty({
    description: 'The private key of the wallet address',
    example:
      'https://app.gameshift.dev/consent?transaction=fca54f7e-4f9d-4f05-8b16-85b5d7689552',
  })
  privateKey: string;
}

export class SendSolDto {
  @ApiProperty({
    description: 'The amount to send',
  })
  amount: number;

  @ApiProperty({
    description: 'The public address of the sender',
  })
  fromPublic: string;

  @ApiProperty({
    description: 'The private key of the sender',
  })
  fromPrivate: string;

  @ApiProperty({
    description: 'The public address of the receiver',
  })
  toPublic: string;
}

export class WalletAddressDto {
  @ApiProperty({
    description: 'The wallet address of the receiving airdrop',
  })
  walletAddress: string;
}
