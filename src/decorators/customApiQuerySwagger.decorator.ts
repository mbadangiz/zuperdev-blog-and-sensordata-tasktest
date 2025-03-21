import { applyDecorators } from "@nestjs/common";
import { ApiQuery, ApiQueryOptions } from "@nestjs/swagger";

export const CustomApiQuerySwagger = (queryLists: ApiQueryOptions[]) => {
  return applyDecorators(...queryLists.map((query) => ApiQuery(query)));
};
