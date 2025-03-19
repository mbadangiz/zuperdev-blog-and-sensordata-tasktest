import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { customInternalServerError } from "src/utils/customInternalServerError.utils";
import { UpdateProfileDto } from "./dto/updateProfile.dto";
import { AwsUploadService } from "../aws-upload/aws-upload.service";

@Injectable()
export class ProfileService {
  private readonly selectedDataProfile = {
    avatar: true,
    bio: true,
    firstname: true,
    lastname: true,
    createdAt: true,
    updatedAt: true,
    location: {
      select: {
        address: true,
        city: true,
        country: true,
        state: true,
        zipCode: true,
      },
    },
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly upload: AwsUploadService,
  ) {}

  private async checkProfileExists(userid: string) {
    const userProfile = await this.prisma.profile.findUnique({
      where: { userId: userid },
      select: this.selectedDataProfile,
    });

    if (!userProfile) {
      throw new NotFoundException({
        success: false,
        message: "Profile Not Found",
      });
    }

    return userProfile;
  }

  async getProfile(req) {
    try {
      const userId = req.userid;
      const userProfile = await this.checkProfileExists(userId);

      const profilesFlated = { ...userProfile, ...userProfile.location };
      const { location, ...profileWithoutLocation } = profilesFlated;
      const profileProperties = Object.keys(profileWithoutLocation);

      const filledData: (string | number | boolean)[] = [];
      profileProperties.forEach((item) => {
        if (profilesFlated[item]) {
          filledData.push(profilesFlated[item]);
        }
      });

      const profileCompletionPercentage = Math.floor(
        (filledData.length / profileProperties.length) * 100,
      );

      return {
        success: true,
        profile: userProfile,
        profileCompletionPercentage,
        message:
          profileCompletionPercentage < 80
            ? "Please complete your profile to be able to use our services."
            : "See Your Profile.",
      };
    } catch (error) {
      console.log(error);
      customInternalServerError();
    }
  }

  async updateProfile(req, file: Express.Multer.File, body: UpdateProfileDto) {
    const userId = req.userid;
    const profile = await this.checkProfileExists(userId);

    let url: string = "";

    if (file) {
      if (profile.avatar) {
        const bucketName = profile.avatar.split("/");

        const delPrevAvatar = await this.upload.delete(
          bucketName[bucketName.length - 1],
          { url: bucketName.join("/") },
        );

        if (!delPrevAvatar?.success) {
          throw new InternalServerErrorException({
            success: false,
            message: "Changig Profile Image is fail.",
          });
        }
      }
      const uploadedfiles = await this.upload.upload(file, {
        filename: `image-profile-${userId}`,
      });

      url = uploadedfiles!.url;
    }

    const profileData = {
      avatar: url,
      bio: body.bio,
      firstname: body.firstname,
      lastname: body.lastname,
    };

    const locationData = {
      address: body.address,
      city: body.city,
      country: body.country,
      state: body.state,
      zipCode: body.zipCode,
    };

    try {
      const updateProfile = await this.prisma.profile.update({
        where: { userId },
        data: {
          ...profileData,
          location: {
            upsert: {
              create: { ...locationData },
              update: { ...locationData },
            },
          },
        },
        select: this.selectedDataProfile,
      });

      return {
        success: false,
        message: "",
        profile: updateProfile,
      };
    } catch (error) {
      console.log(error);
      customInternalServerError();
    }
  }
}
