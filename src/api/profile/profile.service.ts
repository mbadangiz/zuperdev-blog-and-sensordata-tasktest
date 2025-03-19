import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { customInternalServerError } from "src/utils/customInternalServerError.utils";

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  private async checkProfileExists(userid: string) {
    const userProfile = await this.prisma.profile.findUnique({
      where: { userId: userid },
      select: {
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
      },
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

  async updateProfile(req) {
    const userid = req.userid;
    const profile = await this.checkProfileExists(userid);
    return profile;
  }
}
