import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from "class-validator";

export class SignupAuthDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30, {
    message: "The maximum length of a username should be 30 characters.",
  })
  @MinLength(5, {
    message: "The minimum length of a username should be 5 characters.",
  })
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(80, {
    message: "The maximum length of a username should be 80 characters.",
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword(
    { minLength: 8 },
    {
      message:
        "Your password must be a combination of numbers, uppercase and lowercase letters, and special characters.",
    },
  )
  password: string;
}

export const SignupAuthDtoSwagger = {
  schema: {
    type: "object",
    properties: {
      username: {
        type: "string",
        description: "The username for the new user.",
        example: "john_doe123",
        minLength: 5,
        maxLength: 30,
      },
      email: {
        type: "string",
        format: "email",
        description: "The email address for the new user.",
        example: "john.doe@example.com",
        maxLength: 80,
      },
      password: {
        type: "string",
        description:
          "The password for the new user. Must be a strong password.",
        example: "P@$$wOrd123!",
        minLength: 8,
        format: "password",
        pattern:
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
      },
    },
    required: ["username", "email", "password"],
  },
};
