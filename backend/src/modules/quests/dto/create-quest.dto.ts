import { Type } from 'class-transformer';
import { IsInt, IsString, MaxLength, Min } from 'class-validator';

export class CreateQuestDto {
  @IsString()
  @MaxLength(120)
  title!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  plannedDurationMinutes!: number;
}
