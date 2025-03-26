import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { Request } from "express";
import { CustomApiQuerySwagger } from "src/decorators/customApiQuerySwagger.decorator";
import { useRoles } from "src/decorators/useRoles.decorators";
import { UserRole } from "src/types/enum";
import { BlogService } from "./blog.service";
import {
  AddUpdateRateDto,
  AddUpdateRateDtoSwagger,
} from "./dto/add-update-rate.dto";
import { CreateBlogDto, CreateBlogDtoSwagger } from "./dto/create-blog.dto";
import {
  SearchQueryDtoForBlog,
  SearchQueryDtoForBlogSwagger,
} from "./dto/get-all-blog.dto";
import { UpdateBlogDto, UpdateBlogDtoSwagger } from "./dto/update-blog.dto";
import {
  CreateCommentDto,
  CreateCommentDtoSwagger,
} from "./dto/create-comment.dto";
import {
  CreateCommentReplyDto,
  CreateCommentReplyDtoSwagger,
} from "./dto/create-comment-reply.dto";
import { PageQuerySwagger } from "./dto/get-comments.dto";

@Controller("blog")
@useRoles(UserRole.ADMIN, UserRole.EDITOR, UserRole.ORDINAL)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}
  @Get("listSreachFilter")
  @CustomApiQuerySwagger(SearchQueryDtoForBlogSwagger)
  blogListUser(@Query() query: SearchQueryDtoForBlog) {
    return this.blogService.getBlogList(query);
  }

  @Get("detail/:id")
  @ApiOperation({ summary: "Get blog details" })
  @ApiParam({ name: "id", description: "Blog ID" })
  blogDetail(@Param("id") id: string, @Req() req: Request) {
    return this.blogService.getBlogDetail(id, req);
  }

  @Post("create")
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiBody(CreateBlogDtoSwagger)
  createBlog(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateBlogDto,
  ) {
    return this.blogService.createBlog(req, file, body);
  }

  @Put("update/:id")
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiBody(UpdateBlogDtoSwagger)
  updateBlog(
    @Param("id") id: string,
    @Body() body: UpdateBlogDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.blogService.updateBlog(id, body, file);
  }

  @Post("like/:id")
  likeBlog(@Param("id") id: string, @Req() req: Request) {
    return this.blogService.likeBlog(id, req);
  }

  @Delete("unlike/:id")
  unLikeBlog(@Param("id") id: string, @Req() req: Request) {
    return this.blogService.unlike(id, req);
  }

  @Post("add-update-rate/:id")
  @ApiBody(AddUpdateRateDtoSwagger)
  addUpdateRate(
    @Param("id") id: string,
    @Req() req: Request,
    @Body() body: AddUpdateRateDto,
  ) {
    return this.blogService.addUpdateRate(id, req, body);
  }

  @Delete("delete-rate/:id")
  deleteRate(@Param("id") id: string, @Req() req: Request) {
    return this.blogService.deleteRate(id, req);
  }

  @Post("comment")
  @ApiBody(CreateCommentDtoSwagger)
  createComment(@Body() body: CreateCommentDto, @Req() req: Request) {
    return this.blogService.createComment(body, req);
  }

  @Post("comment-reply")
  @ApiBody(CreateCommentReplyDtoSwagger)
  createCommentReply(@Body() body: CreateCommentReplyDto, @Req() req: Request) {
    return this.blogService.createCommentReply(body, req);
  }

  @Get("blogsComments/:id")
  @ApiQuery(PageQuerySwagger)
  getBlogsComment(@Param("id") id: string, @Query("page") page: number) {
    return this.blogService.getBlogsComment(id, page);
  }
}
