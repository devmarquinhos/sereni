import { IsEnum, IsOptional } from 'class-validator';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class GetJournalQueryDto {
  @IsEnum(SortOrder)
  @IsOptional()
  sort?: SortOrder = SortOrder.DESC;
}
