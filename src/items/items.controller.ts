import { Controller, Get } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Items')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @ApiOperation({
    summary: 'Get all items and currencies that have been registered',
  })
  @Get()
  fetchItems(): any {
    return this.itemsService.getAllItems();
  }
}
