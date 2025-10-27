import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateJournalEntryDto {
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  mood_rating: number;

  @IsString()
  @IsOptional()
  entry_text?: string;
}
