import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserInfoDto } from './user.dto';
import { UserEntity } from '@/entities/user.entity';
import { Public } from '@/decorators/public.decorator';
import { IUser, User } from '@/decorators/user.decorator';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '查看个人信息' })
  @Get('profile')
  @UseInterceptors(ClassSerializerInterceptor)
  public getUserProfile(@User() user: IUser): Promise<UserEntity> {
    return this.userService.findOne({ id: user.userId });
  }

  @Put('profile')
  @ApiOperation({ summary: '更新个人资料' })
  async updateUserProfile(
    @User() user: IUser,
    @Body() updateUserDto: UpdateUserInfoDto,
  ): Promise<UserEntity> {
    return this.userService.updateUserProfile(user.userId, updateUserDto);
  }

  @Get(':username')
  @ApiOperation({ summary: '搜索用户' })
  findOne(@Param('username') username: string) {
    return this.userService.searchUsers(username);
  }
}
