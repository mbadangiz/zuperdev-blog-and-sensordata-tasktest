import { IsBoolean, IsOptional, IsString } from "class-validator";

export class LoginDto {
  @IsString()
  emailOrUsername: string;

  @IsString()
  password: string;

  @IsBoolean()
  @IsOptional()
  rememberme: boolean;
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
      rememberme: {
        type: "boolean",
        description: "make choose for",
        example: true,
        minLength: 8,
      },
    },
    required: ["emailOrUername", "password", "rememberme"],
  },
};
