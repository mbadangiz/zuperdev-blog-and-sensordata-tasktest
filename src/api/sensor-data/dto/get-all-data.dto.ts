import { IsOptional, IsInt, IsString } from "class-validator";
import { Type } from "class-transformer";

export const searchQuerySwagger = [
  {
    name: "search",
    required: false,
    type: String,
    description: "Search query",
  },
  {
    name: "page",
    required: false,
    type: Number,
    description: "Page number",
  },
  {
    name: "limit",
    required: false,
    type: Number,
    description: "Limit of items per page",
  },
];

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
