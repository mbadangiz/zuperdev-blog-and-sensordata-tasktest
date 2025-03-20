import {
  IsEmail,
  IsStrongPassword,
  Length,
  MaxLength,
  MinLength,
  IsString,
} from "class-validator";

export const SignupStepOneDtoSwagger = {
  schema: {
    type: "object",
    properties: {
      email: {
        type: "string",
        description: "Enter Email adress for reciving verificaion code",
        example: "a@b.com",
        minLength: 5,
        maxLength: 80,
      },
    },
    required: ["email"],
  },
};

export class SignupStepOne {
  @IsEmail()
  @MinLength(5, { message: "The Minimum Length is 5" })
  @MaxLength(80, { message: "The Maximum Length is 80" })
  email: string;
}

export const SignupStepTwoDtoSwagger = {
  schema: {
    type: "object",
    properties: {
      verificationCode: {
        type: "string",
        description: "Enter  Verification code",
        example: "10250",
        length: 5,
      },
      email: {
        type: "string",
        description: "Enter Email adress for reciving verificaion code",
        example: "a@b.com",
        minLength: 5,
        maxLength: 80,
      },
    },
    required: ["verificationCode", "email"],
  },
};

export class SignupStepTwo {
  @IsString()
  @MinLength(5, { message: "The Minimum Length is 5" })
  @MaxLength(80, { message: "The Maximum Length is 80" })
  verificationCode: string;

  @IsEmail()
  @MinLength(5, { message: "The Minimum Length is 5" })
  @MaxLength(80, { message: "The Maximum Length is 80" })
  email: string;
}

export const SingupStepThreeDtoSwagger = {
  schema: {
    type: "object",
    properties: {
      username: {
        type: "string",
        description: "Username of the user",
        example: "john_doe",
        minLength: 5,
        maxLength: 30,
      },
      email: {
        type: "string",
        description: "Email address of the user",
        example: "john.doe@example.com",
        minLength: 5,
        maxLength: 80,
      },
      password: {
        type: "string",
        description: "Password for the user account",
        example: "Str0ng#Passw0rd",
        maxLength: 255,
        minLength: 8,
        RegExp:
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$",
      },
    },
    required: ["username", "email", "password"],
  },
};

export class SingupStepThree {
  @IsEmail()
  @MaxLength(80, { message: "The Email can`t be morethan 80 characters" })
  email: string;

  @MinLength(5, { message: "The Minimum Length is 5" })
  @MaxLength(30, { message: "The Maximum Length is 30" })
  username: string;

  @MaxLength(255, { message: "The Maximum Length is 255" })
  @IsStrongPassword(
    { minLength: 8 },
    {
      message:
        "The password must be at least 8 characters long, consisting of a combination of numbers, lowercase and uppercase letters, and special characters.",
    },
  )
  password: string;
}
