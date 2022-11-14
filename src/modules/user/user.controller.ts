import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserInfoDto, UpdateUserPasswordDto } from './user.dto';
import { UserEntity } from '@/entities/user.entity';
import { IUser, User } from '@/common/decorators/user.decorator';
import { LoginToken } from '@/modules/auth/auth.class';
import { ApiOkResponseData } from '@/common/class/res.class';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '查看个人信息' })
  @ApiOkResponseData(UserEntity)
  @Get('profile')
  @UseInterceptors(ClassSerializerInterceptor)
  public getUserProfile(@User() user: IUser): Promise<UserEntity> {
    return this.userService.findOneBy({ id: user.userId });
  }

  @Put('profile')
  @ApiOkResponseData(UserEntity)
  @ApiOperation({ summary: '更新个人资料' })
  async updateUserProfile(
    @User() user: IUser,
    @Body() updateUserDto: UpdateUserInfoDto,
  ): Promise<UserEntity> {
    return this.userService.updateUserProfile(user.userId, updateUserDto);
  }

  @Put('password')
  @ApiOperation({ summary: '更改个人密码' })
  @ApiOkResponseData(LoginToken)
  async updateUserPassword(
    @User() user: IUser,
    @Body() updateUserDto: UpdateUserPasswordDto,
  ): Promise<LoginToken> {
    return this.userService.updateUserPassword(user.userId, updateUserDto);
  }

  @Get(':username')
  @ApiOperation({ summary: '搜索用户' })
  @ApiOkResponseData(UserEntity, 'array')
  findOne(@Param('username') username: string) {
    return this.userService.searchUsers(username);
  }
}
