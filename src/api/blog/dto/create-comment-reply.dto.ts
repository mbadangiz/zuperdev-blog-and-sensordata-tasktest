import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateCommentReplyDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1, { message: "The comment cannot be empty" })
  content: string;

  @IsNotEmpty()
  @IsString()
  blogId: string;

  @IsNotEmpty()
  @IsString()
  parentId: string;
}
export const CreateCommentReplyDtoSwagger = {
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
      parentId: {
        type: "string",
        description: "The ID of the comment being commented on",
        example: "987e6543-b21d-45c9-a123-123456789abc",
      },
    },
    required: ["content", "blogId", "parentId"],
  },
};
