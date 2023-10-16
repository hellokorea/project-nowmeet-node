import {
  Controller,
  Get,
  UseInterceptors,
  Post,
  Body,
  Req,
  UploadedFiles,
  Put,
  Param,
  UseGuards,
  ParseIntPipe,
  Delete,
  UploadedFile,
} from "@nestjs/common";
import { UsersService } from "../service/users.service";
import { SuccessInterceptor } from "src/common/interceptors/success.interceptor";
import { UserCreateDto } from "../dtos/users.create.dto";
import { FilesInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "src/auth/jwt/jwt.guard";
import { UserRequestDto } from "../dtos/users.request.dto";
import { UserNicknameDuplicateDto } from "../dtos/users.nickname.duplicate";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { PutMyInfoResponseDto } from "../dtos/user.putMyInfo.dto";

@ApiBearerAuth()
@Controller("users")
@UseInterceptors(SuccessInterceptor)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({ summary: "모든 유저 정보 조회 (테스트 용도)" })
  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @ApiResponse({ description: "개발 중 ..." })
  @ApiOperation({ summary: "유저 위치 정보 최신화" })
  @ApiParam({ name: "nickname", description: "위치 정보 최신화 할 유저 닉네임 입력", type: String })
  @Get("location/:nickname/:x/:y")
  // @UseGuards(JwtAuthGuard) //^^^^^^^^^^^^^^^^^^^^^^jwt
  UserLocationRefresh(@Param("nickname") nickname: string, @Param("x") x: string, @Param("y") y: string) {
    return this.userService.UserLocationRefresh(nickname, x, y);
  }

  @ApiResponse({ type: UserCreateDto })
  @ApiOperation({ summary: "유저 회원가입" })
  @UseInterceptors(FilesInterceptor("profileImages"))
  @Post("signup")
  createUser(@Body() body: UserCreateDto, @UploadedFiles() files: any) {
    return this.userService.createUser(body, files);
  }

  @ApiResponse({ description: "true || false", type: Boolean })
  @ApiOperation({ summary: "유저 회원가입 시 닉네임 중복 체크" })
  @Get("signup/nickname")
  nicknameDuplicate(@Body() body: UserNicknameDuplicateDto) {
    return this.userService.nicknameDuplicate(body);
  }

  @ApiOperation({ summary: "내 프로필 정보 조회" })
  @Get("me")
  @UseGuards(JwtAuthGuard)
  getMyUserInfo(@Req() req: UserRequestDto) {
    return this.userService.getMyUserInfo(req);
  }

  @ApiOperation({ summary: "내 프로필 수정" })
  @ApiBody({ description: "직업, 소개, 취향 항목만 수정 가능", type: PutMyInfoResponseDto })
  @Put("me/update")
  @UseGuards(JwtAuthGuard)
  putMyUserInfo(@Body() body: any, @Req() req: UserRequestDto) {
    return this.userService.putMyUserInfo(body, req);
  }

  @ApiOperation({ summary: "내 계정 삭제" })
  @Delete("me/delete")
  @UseGuards(JwtAuthGuard)
  deleteAccount(@Req() req: UserRequestDto) {
    return this.userService.deleteAccount(req);
  }
}
