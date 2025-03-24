import { IsOptional, IsInt, IsString } from "class-validator";
import { Type } from "class-transformer";
import { ApiQueryOptions } from "@nestjs/swagger";

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
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ each: true })
  categoryId?: number[];
}
