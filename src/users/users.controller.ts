import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  fetchUsers(): any {
    return this.usersService.getAllUsers();
  }

  @Post()
  registerUser(@Body() body): any {
    const { referenceId, email } = body;
    return this.usersService.registerUser(referenceId, email);
  }

  @Get('/wallet-address/:referenceId')
  getUserWalletAddress(@Param('referenceId') referenceId: string): any {
    return this.usersService.getUserWalletAddress(referenceId);
  }

  @Get('/:referenceId/items/:itemId')
  getUserItemDetails(
    @Param('referenceId') referenceId: string,
    @Param('itemId') itemId: string,
  ): any {
    return this.usersService.getUserItemDetails(referenceId, itemId);
  }

  @Post('/:referenceId/items/:itemId/transfer')
  transferItem(
    @Param('referenceId') referenceId: string,
    @Param('itemId') itemId: string,
    @Body() body,
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
