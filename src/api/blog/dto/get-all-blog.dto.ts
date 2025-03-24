import { IsOptional, IsInt, IsString, Min, Max } from "class-validator";
import { Type } from "class-transformer";
import { ApiQueryOptions, ApiProperty } from "@nestjs/swagger";

export const SearchQueryDtoForBlogSwagger: ApiQueryOptions[] = [
  {
    name: "search",
    required: false,
    type: String,
    description: "Search query",
    enumName: "SearchQuery",
  },
  {
    name: "page",
    required: false,
    type: Number,
    description: "Page number",
    enumName: "PageQuery",
  },
  {
    name: "limit",
    required: false,
    type: Number,
    description: "Limit of items per page",
    enumName: "LimitQuery",
  },
  {
    name: "categoryId",
    required: false,
    type: Number,
    description: "Category ID",
    enumName: "CategoryQuery",
  },
];

export class SearchQueryDtoForBlog {
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: "Search in blog title and content",
    example: "technology",
  })
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({
    required: false,
    description: "Page number (starts from 1)",
    default: 1,
    minimum: 1,
  })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @ApiProperty({
    required: false,
    description: "Number of items per page",
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  limit?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ each: true })
  @ApiProperty({
    required: false,
    description: "Filter by category IDs",
    type: [Number],
    example: [1, 2],
  })
  categoryId?: number[];
}
