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
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
} from "@nestjs/swagger";
import { Request } from "express";
import { useRoles } from "src/decorators/useRoles.decorators";
import { UserRole } from "src/types/enum";
import { BlogService } from "./blog.service";
import {
  AddUpdateRateDto,
  AddUpdateRateDtoSwagger,
} from "./dto/add-update-rate.dto";
import { CreateBlogDto, CreateBlogDtoSwagger } from "./dto/create-blog.dto";
import { UpdateBlogDto, UpdateBlogDtoSwagger } from "./dto/update-blog.dto";
import { CustomApiQuerySwagger } from "src/decorators/customApiQuerySwagger.decorator";
import {
  SearchQueryDtoForBlog,
  SearchQueryDtoForBlogSwagger,
} from "./dto/get-all-blog.dto";
import { OptionalJwtAuthGuard } from "src/guard/optional-jwt-auth.guard";

@Controller("blog")
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
  @useRoles(UserRole.ADMIN, UserRole.EDITOR, UserRole.ORDINAL)
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
  @useRoles(UserRole.ADMIN, UserRole.EDITOR, UserRole.ORDINAL)
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
  @useRoles(UserRole.ADMIN, UserRole.EDITOR, UserRole.ORDINAL)
  likeBlog(@Param("id") id: string, @Req() req: Request) {
    return this.blogService.likeBlog(id, req);
  }

  @Delete("unlike/:id")
  @useRoles(UserRole.ADMIN, UserRole.EDITOR, UserRole.ORDINAL)
  unLikeBlog(@Param("id") id: string, @Req() req: Request) {
    return this.blogService.unlike(id, req);
  }

  @Post("add-update-rate/:id")
  @useRoles(UserRole.ADMIN, UserRole.EDITOR, UserRole.ORDINAL)
  @ApiBody(AddUpdateRateDtoSwagger)
  addUpdateRate(
    @Param("id") id: string,
    @Req() req: Request,
    @Body() body: AddUpdateRateDto,
  ) {
    return this.blogService.addUpdateRate(id, req, body);
  }

  @Delete("delete-rate/:id")
  @useRoles(UserRole.ADMIN, UserRole.EDITOR, UserRole.ORDINAL)
  deleteRate(@Param("id") id: string, @Req() req: Request) {
    return this.blogService.deleteRate(id, req);
  }
}
