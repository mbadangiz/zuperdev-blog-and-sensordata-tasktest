import { IsOptional, IsInt, IsString } from "class-validator";
import { Type } from "class-transformer";

export class SearchQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;
}
