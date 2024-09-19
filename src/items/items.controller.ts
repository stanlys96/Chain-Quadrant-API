import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllItemsDto } from './items.dto';

@ApiTags('Items')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @ApiOperation({
    summary: 'Get all items and currencies that have been registered',
  })
  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the item details that have been registered',
    type: AllItemsDto,
  })
  fetchItems(): any {
    return this.itemsService.getAllItems();
  }
}
