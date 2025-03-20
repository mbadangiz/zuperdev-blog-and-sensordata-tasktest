import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: "The Maximum Length is 50" })
  firstname?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50, { message: "The Maximum Length is 50" })
  lastname?: string;

  @IsOptional()
  @IsString()
  @MinLength(30, { message: "The Minimum Length is 30" })
  @MaxLength(150, { message: "The Maximum Length is 150" })
  bio?: string;

  @IsOptional()
  @IsString()
  @MinLength(15, { message: "The Minimum Length is 30" })
  @MaxLength(100, { message: "The Maximum Length is 100" })
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30, { message: "The Maximum Length is 30" })
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30, { message: "The Maximum Length is 30" })
  state?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30, { message: "The Maximum Length is 30" })
  country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20, { message: "The Maximum Length is 20" })
  zipCode?: string;
}

export const UpdateProfileDtoSwagger = {
  schema: {
    type: "object",
    properties: {
      file: {
        type: "string",
        format: "binary",
      },
      firstname: {
        type: "string",
        description: "Your first name (optional)",
        example: "John",
        minLength: 6,
        maxLength: 50,
      },
      lastname: {
        type: "string",
        description: "Your last name (optional)",
        example: "Doe",
        minLength: 6,
        maxLength: 50,
      },
      bio: {
        type: "string",
        description: "A short bio about yourself (optional)",
        example:
          "A passionate developer who loves coding and learning new technologies.",
        minLength: 30,
        maxLength: 150,
      },
      address: {
        type: "string",
        description: "Your address (optional)",
        example: "1234 Elm Street, Apt 56",
        minLength: 30,
        maxLength: 100,
      },
      city: {
        type: "string",
        description: "Your city (optional)",
        example: "Los Angeles",
        maxLength: 30,
      },
      state: {
        type: "string",
        description: "Your state or region (optional)",
        example: "California",
        maxLength: 30,
      },
      country: {
        type: "string",
        description: "Your country (optional)",
        example: "United States",
        maxLength: 30,
      },
      zipCode: {
        type: "string",
        description: "Your postal or ZIP code (optional)",
        example: "90001",
        maxLength: 20,
      },
    },
  },
};
