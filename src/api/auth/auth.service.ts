import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GoneException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare, hash } from "bcrypt";
import { VerificationMail } from "src/configs/mailTemplates.configs";
import { MailerService } from "src/api/mailer/mailer.service";
import { PrismaService } from "src/prisma/prisma.service";
import { customInternalServerError } from "src/utils/customInternalServerError.utils";
import { generateRandomNumberByLength } from "src/utils/generateRandomNumberByLength";
import { SignupAuthDto } from "./dto/auth.dto";
import { LoginDto } from "./dto/login.dto";
import { SignupStepTwo, SingupStepThree } from "./dto/signup.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly nodeMailer: MailerService,
  ) {}

  private async generateJWT(payload: any) {
    const [at, rt] = await Promise.all([
      this.jwt.signAsync(
        { ...payload },
        { secret: process.env.JWTSECRET, expiresIn: 60 * 30 },
      ),
      this.jwt.signAsync(
        { ...payload },
        { secret: process.env.JWTSECRET, expiresIn: 60 * 60 * 24 * 7 },
      ),
    ]);

    return { accessToken: at, refreshToken: rt };
  }

  private async hashData(pass: string) {
    return await hash(pass, Number(process.env.COSTFACTOR) || 10);
  }

  private async findUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user)
      throw new ConflictException({
        success: false,
        message: "Email is already in use.",
      });
  }
  private async findUserByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (user)
      throw new ConflictException({
        success: false,
        message: "This Username is Taken.",
      });
  }

  private async findEmailInOtpRecs(email: string) {
    const otpRec = await this.prisma.oTPVerification.findUnique({
      where: { email },
    });

    if (otpRec && otpRec.hasVerified === true)
      throw new ConflictException({
        success: false,
        message:
          "The entered email has already been verified. Please proceed to complete your information.",
        nextStep: "Finnal Step",
      });
  }

  async signupStep1(email: string) {
    try {
      await this.findUserByEmail(email);
      await this.findEmailInOtpRecs(email);

      const randomNumber = generateRandomNumberByLength(5);
      const expirationDate = new Date(Date.now() + 2 * 60 * 1000);
      const updatingData = {
        verificationCode: randomNumber,
        expirationDate: expirationDate,
      };

      const newOtpRec = await this.prisma.oTPVerification.upsert({
        where: {
          email: email,
        },
        update: updatingData,
        create: {
          ...updatingData,
          email: email,
        },
      });

      if (!newOtpRec)
        throw new InternalServerErrorException({
          success: false,
          message: "Failed to create OTP record.",
        });

      const emailHtml = VerificationMail(randomNumber);

      const data = await this.nodeMailer.sendEmail(
        email,
        "Verification Code",
        "",
        emailHtml,
      );

      return {
        success: true,
        message:
          "An email containing the activation code has been sent to you. Please check your email.",
        nextStep: "Verify activation code",
      };
    } catch (error) {
      return error;
    }
  }

  async signupStep2(body: SignupStepTwo) {
    await this.findUserByEmail(body.email);
    await this.findEmailInOtpRecs(body.email);

    const optRec = await this.prisma.oTPVerification.findUnique({
      where: { email: body.email },
    });

    if (!optRec) {
      throw new NotFoundException({
        status: false,
        message: "The specified email does not exist in the system.",
      });
    }
    const now = new Date();

    if (now > optRec.expirationDate) {
      throw new GoneException({
        success: false,
        message: "The OTP has expired. Please request a new one.",
      });
    }

    if (optRec.verificationCode !== body.verificationCode) {
      throw new BadRequestException({
        success: false,
        message: "The verification code is incorrect.",
      });
    }

    try {
      await this.prisma.oTPVerification.update({
        where: { email: body.email },
        data: {
          hasVerified: true,
        },
      });

      return {
        success: true,
        message:
          "Your email verification was successful. Please proceed to complete your information in the next step.",
      };
    } catch (error) {
      customInternalServerError();
    }
  }

  async signupStep3(body: SingupStepThree) {
    await this.findUserByUsername(body.username);
    await this.findUserByEmail(body.email);

    const verifyEmailOTPVerification =
      await this.prisma.oTPVerification.findUnique({
        where: { email: body.email },
      });

    if (
      !verifyEmailOTPVerification ||
      !verifyEmailOTPVerification.hasVerified
    ) {
      throw new ForbiddenException({
        success: false,
        message: "Email is not verified.",
      });
    }

    const hashedPass = await this.hashData(body.password);

    try {
      const createUser = await this.prisma.user.create({
        data: {
          ...body,
          password: hashedPass,
          profile: { create: { location: { create: {} } } },
        },
      });
      const tokens = await this.generateJWT({ userid: createUser.userId });

      return {
        success: true,
        message: "The user has been created successfully.",
        userid: createUser.userId,
        token: tokens.refreshToken,
      };
    } catch (error) {
      customInternalServerError();
    }
  }

  async login(body: LoginDto) {
    const { emailOrUsername, password } = body;
    let where;
    if (emailOrUsername.includes("@")) where = { email: emailOrUsername };
    else where = { username: emailOrUsername };

    const user = await this.prisma.user.findUnique({
      where,
      include: { UsersRoles: { include: { roles: true } } },
    });

    if (!user) {
      throw new NotFoundException({
        success: false,
        message: "No user was found with the provided credentials.",
      });
    }

    const comparedPassword = await compare(password, user.password);

    if (!comparedPassword) {
      throw new ForbiddenException({
        success: false,
        message: "The username or password is incorrect.",
      });
    }

    const roles = user.UsersRoles.map((item) => {
      return item.roles.name;
    });

    const token = await this.generateJWT({ userid: user.userId, roles });

    try {
      const hashedRT = await this.hashData(token.refreshToken);

      await this.prisma.hashedTokes.upsert({
        where: { userid: user.userId },
        create: { userid: user.userId, hashedRT },
        update: { hashedRT },
      });

      return {
        success: true,
        message: "Successful login",
        roles,
        username: user.username,
        email: user.email,
        tokens: body.rememberme ? token.refreshToken : token.accessToken,
      };
    } catch (error) {
      customInternalServerError();
    }
  }

  async localSignup(dto: SignupAuthDto) {
    const { username, email } = dto;

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      if (existingUser.username === username) {
        throw new ConflictException({
          success: false,
          message: "Username is already taken.",
        });
      }
      if (existingUser.email === email) {
        throw new ConflictException({
          success: false,
          message: "Email is already in use.",
        });
      }
    }

    const hashedPass = await this.hashData(dto.password);

    const newUser = await this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPass,
        profile: {
          create: { location: { create: {} } },
        },
      },
      include: { profile: { include: { location: true } } },
    });

    const token = await this.jwt.signAsync(
      {
        userId: newUser.userId,
      },
      { secret: process.env.ACT_JWTSECRET, expiresIn: 60 * 60 * 24 * 7 },
    );

    return {
      success: true,
      message: "The user has been successfully created.",
      userid: newUser.userId,
      token,
    };
  }

  async localSignin() {
    const data = this.generateJWT({ userid: "vsd" });
    return data;
  }
}
