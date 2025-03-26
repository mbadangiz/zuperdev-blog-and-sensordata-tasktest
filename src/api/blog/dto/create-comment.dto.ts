import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1, { message: "The comment cannot be empty" })
  content: string;

  @IsNotEmpty()
  @IsString()
  blogId: string;
}
export const CreateCommentDtoSwagger = {
  schema: {
    type: "object",
    properties: {
      content: {
        type: "string",
        description: "The content of the comment",
        example: "This is a comment on the blog post.",
        minLength: 1,
        errorMessage: {
          minLength: "The comment cannot be empty",
        },
      },
      blogId: {
        type: "string",
        description: "The ID of the blog post being commented on",
        example: "987e6543-b21d-45c9-a123-123456789abc",
      },
    },
    required: ["content", "blogId"],
  },
};
