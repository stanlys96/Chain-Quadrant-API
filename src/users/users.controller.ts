import { Controller, Post, Get, Body, Param, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  AllUsersDto,
  CreateSolanaAddressDto,
  CreateUserDto,
  TransferItemDto,
  UserItemDto,
  UserRegisterDto,
  UserTransferDto,
  UserWalletDto,
} from './users.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get all users that have registered' })
  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the users that have registered',
    type: AllUsersDto,
  })
  fetchUsers(): any {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({ summary: 'Register user by email' })
  @Post()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the reference id and email of the user registered',
    type: UserRegisterDto,
  })
  registerUser(@Body() body: CreateUserDto): any {
    const { referenceId, email } = body;
    return this.usersService.registerUser(referenceId, email);
  }

  @ApiOperation({ summary: "Get user's wallet address" })
  @Get('/:referenceId/wallet-address')
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Returns the wallet address of the user that's being searched",
    type: UserWalletDto,
  })
  getUserWalletAddress(@Param('referenceId') referenceId: string): any {
    return this.usersService.getUserWalletAddress(referenceId);
  }

  @ApiOperation({ summary: 'Get the item details of a user' })
  @Get('/:referenceId/items/:itemId')
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Returns the item details, and the quantity that the user owns',
    type: UserItemDto,
  })
  getUserItemDetails(
    @Param('referenceId') referenceId: string,
    @Param('itemId') itemId: string,
  ): any {
    return this.usersService.getUserItemDetails(referenceId, itemId);
  }

  @ApiOperation({
    summary: 'Transfer an item/currency from one user to another',
  })
  @Post('/:referenceId/items/:itemId/transfer')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the transaction ID and consent url',
    type: UserTransferDto,
  })
  transferItem(
    @Param('referenceId') referenceId: string,
    @Param('itemId') itemId: string,
    @Body() body: TransferItemDto,
  ): any {
    const { destinationUserReferenceId, quantity } = body;
    return this.usersService.transferItem(
      referenceId,
      itemId,
      destinationUserReferenceId,
      quantity,
    );
  }

  @ApiOperation({
    summary: 'Create a solana wallet address',
  })
  @Post('/create-solana-address')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the transaction ID and consent url',
    type: CreateSolanaAddressDto,
  })
  createSolanaAddress(): any {
    return this.usersService.createSolanaAddress();
  }
}
