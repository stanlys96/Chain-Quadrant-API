import { ApiProperty } from '@nestjs/swagger';

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
