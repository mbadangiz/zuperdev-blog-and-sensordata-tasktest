import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiBody } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { SignupAuthDto, SignupAuthDtoSwagger } from "./dto/auth.dto";
import { LoginDto, LoginDtoSwagger } from "./dto/login.dto";
import {
  SignupStepOne,
  SignupStepOneDtoSwagger,
  SignupStepTwo,
  SignupStepTwoDtoSwagger,
  SingupStepThree,
  SingupStepThreeDtoSwagger,
} from "./dto/signup.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @Post("local/signup")
  @ApiBody(SignupAuthDtoSwagger)
  localSignup(@Body() dto: SignupAuthDto) {
    return this.AuthService.localSignup(dto);
  }

  @Post("local/signup/step1")
  @HttpCode(HttpStatus.OK)
  @ApiBody(SignupStepOneDtoSwagger)
  stepOne(@Body() signUpStepOneDto: SignupStepOne) {
    return this.AuthService.signupStep1(signUpStepOneDto.email);
  }

  @Post("local/signup/step2")
  @HttpCode(HttpStatus.OK)
  @ApiBody(SignupStepTwoDtoSwagger)
  stepTwo(@Body() body: SignupStepTwo) {
    return this.AuthService.signupStep2(body);
  }

  @Post("local/signup/step3")
  @ApiBody(SingupStepThreeDtoSwagger)
  stepThree(@Body() body: SingupStepThree) {
    return this.AuthService.signupStep3(body);
  }

  @Post("local/login")
  @HttpCode(HttpStatus.OK)
  @ApiBody(LoginDtoSwagger)
  login(@Body() body: LoginDto) {
    return this.AuthService.login(body);
  }
}
