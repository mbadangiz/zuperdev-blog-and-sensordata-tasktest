import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { SignupAuthDto, SignupAuthDtoSwagger } from "./dto/auth.dto";
import {
  SignupStepOne,
  SignupStepOneDtoSwagger,
  SignupStepTwo,
  SignupStepTwoDtoSwagger,
  SingupStepThree,
  SingupStepThreeDtoSwagger,
} from "./dto/signup.dto";
import { Tokens } from "./types/token.types";
import { LoginDto, LoginDtoSwagger } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @Post("local/signup")
  @ApiBody(SignupAuthDtoSwagger)
  localSignup(@Body() dto: SignupAuthDto) {
    return this.AuthService.localSignup(dto);
  }

  @Post("local/signup/step1")
  @ApiBody(SignupStepOneDtoSwagger)
  stepOne(@Body() signUpStepOneDto: SignupStepOne) {
    return this.AuthService.signupStep1(signUpStepOneDto.email);
  }

  @Post("local/signup/step2")
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
  @ApiBody(LoginDtoSwagger)
  login(@Body() body: LoginDto) {
    return this.AuthService.login(body);
  }

  @Post("local/signin")
  localSignin(): Promise<Tokens> {
    return this.AuthService.localSignin();
  }

  @Post("logout")
  logOut() {
    return this.AuthService.logOut();
  }

  @Post("refresh")
  refereshToken() {
    return this.AuthService.refereshToken();
  }
}
