import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { In_userProfile } from "src/types/interface";
import { customInternalServerError } from "src/utils/customInternalServerError.utils";
import { AwsUploadService } from "../aws-upload/aws-upload.service";
import { UpdateProfileDto } from "./dto/updateProfile.dto";

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

  private profilePercentage(userProfile: In_userProfile) {
    const profilesFlated = { ...userProfile, ...userProfile.location };
    const { location, createdAt, updatedAt, ...profileWithoutLocation } =
      profilesFlated;
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
    return profileCompletionPercentage;
  }

  async getProfile(req) {
    try {
      const userId = req.userid;
      const userProfile = await this.checkProfileExists(userId);
      const profileCompletionPercentage = this.profilePercentage(userProfile);

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
            message: "Changing Profile Image failed.",
          });
        }
      }
      const uploadedfiles = await this.upload.upload(file, {
        filename: `image-profile-${userId}`,
      });

      url = uploadedfiles!.url;
    }

    const profileData = {
      avatar: url || undefined,
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

      const beforeUpdate = this.profilePercentage(profile);
      const afterUpdate = this.profilePercentage(updateProfile);

      if (afterUpdate >= 75 && beforeUpdate < 75) {
        const existingRole = await this.prisma.usersRoles.findFirst({
          where: {
            userId: userId,
            roles: {
              name: "ORDINAL",
            },
          },
        });

        if (!existingRole) {
          await this.prisma.usersRoles.create({
            data: {
              roleId: 5,
              userId: userId,
            },
          });

          return {
            success: true,
            message:
              "Profile updated successfully. You've been granted Ordinal User status!",
            profile: updateProfile,
          };
        }
      }

      return {
        success: true,
        message: "Profile updated successfully.",
        profile: updateProfile,
      };
    } catch (error) {
      console.log(error);
      customInternalServerError();
    }
  }
}
