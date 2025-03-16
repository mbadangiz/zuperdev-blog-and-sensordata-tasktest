import { IsEmail, IsString, ValidateIf } from "class-validator";

export class LoginDto {
  @IsString()
  emailOrUsername: string;

  @IsString()
  password: string;
}

export const LoginDtoSwagger = {
  schema: {
    type: "object",
    properties: {
      emailOrUsername: {
        type: "string",
        description: "Enter  Verification code",
        example: "username / Email",
        minLength: 5,
      },
      password: {
        type: "string",
        description: "",
        example: "Str0ng#Passw0rd",
        minLength: 8,
      },
    },
    required: ["emailOrUername", "password"],
  },
};
