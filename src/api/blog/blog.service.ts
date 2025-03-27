import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Request } from "express";
import { PrismaService } from "src/prisma/prisma.service";
import { customInternalServerError } from "src/utils/customInternalServerError.utils";
import { User } from "../auth/strategies/types";
import { AwsUploadService } from "../aws-upload/aws-upload.service";
import { AddUpdateRateDto } from "./dto/add-update-rate.dto";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { SearchQueryDtoForBlog } from "./dto/get-all-blog.dto";
import { Prisma } from "@prisma/client";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { CreateCommentReplyDto } from "./dto/create-comment-reply.dto";

@Injectable()
export class BlogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly awsFiles: AwsUploadService,
  ) {}

  private async findBlogById(blogId: string) {
    try {
      const blog = await this.prisma.blog.findUnique({ where: { blogId } });

      if (!blog) {
        throw new NotFoundException({
          success: false,
          message: "Blog Not Found",
        });
      }
      return blog;
    } catch (error) {
      console.error(error);
      throw customInternalServerError();
    }
  }

  private async countTotalLikesByBlog(blogId: string) {
    try {
      return await this.prisma.blogsLikes.count({ where: { blogId } });
    } catch (error) {
      console.error(error);
      throw customInternalServerError();
    }
  }

  private async findLikeByUserId(blogId: string, userId: string) {
    try {
      return await this.prisma.blogsLikes.findUnique({
        where: { blogId_userid: { blogId, userid: userId } },
      });
    } catch (error) {
      console.error(error);
      throw customInternalServerError();
    }
  }

  private async updateBlogTotalLikes(id: string) {
    const totalLike = await this.countTotalLikesByBlog(id);

    return await this.prisma.blog.update({
      where: { blogId: id },
      data: { totalLikes: totalLike },
    });
  }

  private async updateBlogAvgRate(id: string) {
    try {
      const avgData = await this.prisma.blogsRates.aggregate({
        where: { blogId: id },
        _avg: { rate: true },
      });

      await this.prisma.blog.update({
        where: { blogId: id },
        data: { averageRate: avgData._avg.rate ? avgData._avg.rate : 0 },
      });
    } catch (error) {
      throw customInternalServerError();
    }
  }

  async createBlog(
    req: Request,
    file: Express.Multer.File,
    body: CreateBlogDto,
  ) {
    const user = req.user as User;
    const userId = user.userid;
    let image = "random-url";

    if (file) {
      try {
        const data = await this.awsFiles.upload(file, { filename: body.title });

        if (!data?.success) {
          throw customInternalServerError();
        }
        image = data.url!;
      } catch (error) {
        console.log(error);
        throw customInternalServerError();
      }
    }

    const categories = body.categoryIds.map((item) => ({
      cateId: Number(item),
    }));

    try {
      const createNewBlog = await this.prisma.blog.create({
        data: {
          authourId: userId,
          title: body.title,
          content: body.content,
          image: image,
          seoContent: body.seoContent,
          seoTitle: body.seoTitle,
          status: body.status,
          categories: { create: categories },
        },
      });

      return {
        success: true,
        message: "Blog has been created successfully.",
        id: createNewBlog.blogId,
      };
    } catch (error) {
      console.error(error);
      throw customInternalServerError();
    }
  }

  async likeBlog(id: string, req: Request) {
    const user = req.user as User;
    const userId = user.userid;

    try {
      await this.findBlogById(id);
      const isUserLikeExist = await this.findLikeByUserId(id, userId);

      if (isUserLikeExist) {
        throw new ConflictException({
          success: false,
          message: "You have already liked this blog, you can only unlike it.",
        });
      }

      await this.prisma.blogsLikes.create({
        data: { blogId: id, userid: userId },
      });

      await this.updateBlogTotalLikes(id);

      return {
        success: true,
        message: "You liked the blog successfully.",
      };
    } catch (error) {
      throw error;
    }
  }

  async unlike(id: string, req: Request) {
    const user = req.user as User;
    const userId = user.userid;

    try {
      await this.findBlogById(id);
      const isUserLikeExist = await this.findLikeByUserId(id, userId);

      if (!isUserLikeExist) {
        throw new NotFoundException({
          success: false,
          message: "You have not liked this blog yet, you can like it.",
        });
      }

      const deleteUserLike = await this.prisma.blogsLikes.delete({
        where: {
          blogId_userid: { blogId: id, userid: userId },
        },
      });

      await this.updateBlogTotalLikes(id);

      return {
        success: true,
        message: "Your like has been successfully removed.",
      };
    } catch (error) {
      throw error;
    }
  }

  async addUpdateRate(id: string, req: Request, body: AddUpdateRateDto) {
    const user = req.user as User;
    const userid = user.userid;

    try {
      await this.findBlogById(id);

      const uperSetRate = await this.prisma.blogsRates.upsert({
        where: {
          blogId_userid: { blogId: id, userid },
        },
        create: { blogId: id, userid, rate: body.rate },
        update: { rate: body.rate },
      });

      if (!uperSetRate) {
        throw new InternalServerErrorException({
          success: false,
          message: "The operation failed",
        });
      }
      await this.updateBlogAvgRate(id);
      return {
        success: true,
        message: "Your rating has increased.",
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteRate(id: string, req: Request) {
    const user = req.user as User;
    const userid = user.userid;
    try {
      await this.findBlogById(id);

      const findUserRate = await this.prisma.blogsRates.findUnique({
        where: { blogId_userid: { blogId: id, userid } },
      });

      if (!findUserRate) {
        throw new NotFoundException({
          success: false,
          message:
            "You haven't rated this blog yet. To do this, first give a rating to the blog.",
        });
      }

      await this.prisma.blogsRates.delete({
        where: { blogId_userid: { blogId: id, userid } },
      });

      await this.updateBlogAvgRate(id);

      return {
        success: true,
        message: "Your rating has been successfully deleted.",
      };
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw customInternalServerError();
      }
      throw error;
    }
  }

  async updateBlog(
    id: string,
    body: UpdateBlogDto,
    file?: Express.Multer.File,
  ) {
    const myBlog = await this.findBlogById(id);

    let imageNewUrl = myBlog.image;

    if (file) {
      if (myBlog.image) {
        const bucketName = myBlog.image.split("/");
        console.log(bucketName.join("/"));

        const delPrevAvatar = await this.awsFiles.delete(
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
      const uploadedfiles = await this.awsFiles.upload(file, {
        filename: body.title ? body.title : myBlog.title,
      });

      imageNewUrl = uploadedfiles!.url;
    }

    try {
      const data = body;
      delete body.file;

      const updatedBlog = await this.prisma.blog.update({
        where: { blogId: id },
        data: { ...data, image: imageNewUrl },
      });

      if (!updatedBlog) {
        throw customInternalServerError();
      }

      return {
        success: true,
        message: "Your Blog has been updated successfully.",
      };
    } catch (error) {
      console.log(error);
      throw customInternalServerError();
    }
  }

  async getBlogList(query: SearchQueryDtoForBlog) {
    try {
      const { search, page = 1, limit = 10, categoryId } = query;
      const skip = (page - 1) * limit;

      const where = {
        ...(search && {
          OR: [
            { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
            {
              content: { contains: search, mode: Prisma.QueryMode.insensitive },
            },
          ],
        }),
        ...(categoryId && {
          categories: {
            some: {
              cateId: {
                in: Array.isArray(categoryId) ? categoryId : [categoryId],
              },
            },
          },
        }),
      };

      const select = {
        blogId: true,
        title: true,
        content: true,
        status: true,
        image: true,
        averageRate: true,
        publishedAt: true,
        updatedAt: true,
        _count: {
          select: {
            likes: true,
            rates: true,
          },
        },
        categories: {
          select: {
            cateId: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      };

      const [blogs, total] = await Promise.all([
        this.prisma.blog.findMany({
          where,
          select,
          skip,
          take: limit,
          orderBy: {
            blogId: "desc",
          },
        }),
        this.prisma.blog.count({ where }),
      ]);

      const transformedBlogs = blogs.map((blog) => ({
        ...blog,
        categories: blog.categories.map((cat) => ({
          id: cat.cateId,
          name: cat.category.name,
        })),
        totalLikes: blog._count.likes,
        totalRates: blog._count.rates,
        _count: undefined,
      }));

      return {
        success: true,
        data: transformedBlogs,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Blog list error:", error);
      throw customInternalServerError();
    }
  }

  async getBlogDetail(id: string, req: Request) {
    try {
      const blog = await this.prisma.blog.findUnique({
        where: { blogId: id },
        include: {
          categories: {
            include: {
              category: {
                select: {
                  name: true,
                },
              },
            },
          },
          _count: {
            select: {
              likes: true,
              rates: true,
            },
          },

          Comments: {
            select: { content: true },
            take: 1,
            skip: 0,
          },
        },
      });

      if (!blog) {
        throw new NotFoundException({
          success: false,
          message: "Blog not found",
        });
      }

      if (req.user) {
        const user = req.user as User;
        const userId = user.userid;

        const [userLike, userRate] = await Promise.all([
          this.prisma.blogsLikes.findUnique({
            where: {
              blogId_userid: {
                blogId: id,
                userid: userId,
              },
            },
          }),
          this.prisma.blogsRates.findUnique({
            where: {
              blogId_userid: {
                blogId: id,
                userid: userId,
              },
            },
          }),
        ]);

        return {
          success: true,
          data: {
            ...blog,
            Comments: blog.Comments.length ? true : false,
            userInteraction: {
              hasLiked: !!userLike,
              userRate: userRate?.rate || null,
            },
          },
        };
      }

      return {
        success: true,
        data: blog,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw customInternalServerError();
    }
  }

  async createComment(body: CreateCommentDto, req: Request) {
    const user = req.user as User;
    const userId = user.userid;
    await this.findBlogById(body.blogId);
    try {
      const createComment = await this.prisma.comments.create({
        data: {
          ...body,
          userId,
        },
      });

      if (!createComment) {
        throw customInternalServerError();
      }

      return {
        success: true,
        message: "Your Comment added Successfully.",
        commentId: createComment.commentId,
      };
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw customInternalServerError();
      }
      throw error;
    }
  }

  async createCommentReply(body: CreateCommentReplyDto, req: Request) {
    const user = req.user as User;
    const userId = user.userid;
    await this.findBlogById(body.blogId);

    try {
      const createComment = await this.prisma.comments.create({
        data: {
          ...body,
          userId,
        },
      });

      if (!createComment) {
        throw customInternalServerError();
      }

      return {
        success: true,
        message: "Your Comment Reply added Successfully.",
        commentId: createComment.commentId,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof InternalServerErrorException) {
        throw customInternalServerError();
      }
      throw error;
    }
  }

  async getBlogsComment(blogId: string, page: number) {
    const take = 10 * page;

    await this.findBlogById(blogId);
    try {
      const where = { blogId };

      const select = {
        commentId: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            profile: {
              select: { firstname: true, lastname: true, avatar: true },
            },
          },
        },
      };

      const [data, total] = await Promise.all([
        this.prisma.comments.findMany({
          where,
          select: {
            ...select,
            replies: {
              select,
              take: 2,
              skip: 0,
            },
          },
          take: 10,
          skip: 0,
          orderBy: {
            createdAt: "desc",
          },
        }),
        this.prisma.comments.count({ where }),
      ]);

      if (!data) {
        throw customInternalServerError();
      }

      const transformedData = data.map((items) => {
        const tData = {
          ...items,
          user: {
            fullName:
              items.user.profile?.firstname +
              " " +
              items.user.profile?.lastname,
            avatar: items.user.profile?.avatar,
          },
          replies: items.replies.length ? true : false,
        };

        return tData;
      });

      return {
        success: true,
        data: transformedData,
        pagination: {
          total,
          page: Number(page),
          totalPages: Math.ceil(total / take),
        },
      };
    } catch (error) {
      console.log(error);
      if (error instanceof InternalServerErrorException) {
        throw customInternalServerError();
      }
      throw error;
    }
  }
}
