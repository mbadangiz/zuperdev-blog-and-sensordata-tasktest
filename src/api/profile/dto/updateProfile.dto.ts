import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  firstname?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastname?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  bio?: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}

export class UpdateLocationDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  state?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  zipCode?: string;
}
