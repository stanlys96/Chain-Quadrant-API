export interface MetaDto {
  page: number;
  perPage: number;
  totalPages: number;
}

export interface ItemDto {
  id: string;
  mintAddress: string;
  name: string;
  symbol: string;
}

export interface FullItemDto {
  type: string;
  item: ItemDto;
}
