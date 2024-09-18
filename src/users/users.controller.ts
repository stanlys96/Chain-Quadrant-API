import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto, TransferItemDto } from './users.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get all users that have registered' })
  @Get()
  fetchUsers(): any {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({ summary: 'Register user by email' })
  @Post()
  registerUser(@Body() body: CreateUserDto): any {
    const { referenceId, email } = body;
    return this.usersService.registerUser(referenceId, email);
  }

  @ApiOperation({ summary: "Get user's wallet address" })
  @Get('/wallet-address/:referenceId')
  getUserWalletAddress(@Param('referenceId') referenceId: string): any {
    return this.usersService.getUserWalletAddress(referenceId);
  }

  @ApiOperation({ summary: 'Get the item details of a user' })
  @Get('/:referenceId/items/:itemId')
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
}
