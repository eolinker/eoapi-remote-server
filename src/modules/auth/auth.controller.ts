import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Public } from '@/decorators/public.decorator';
import { LoginInfoDto } from '@/modules/auth/dto/login.dto';
import { LoginToken } from '@/modules/auth/auth.class';
import { JwtLogoutDto, JwtRefreshTokenDto } from '@/modules/auth/dto';
import { UserService } from '@/modules/user/user.service';

@ApiTags('auth')
@Controller('auth')
@UseGuards(AuthGuard('api-key'))
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({
    summary: '用户登录/注册',
  })
  @ApiOkResponse({ type: LoginToken })
  @Public()
  @Post('login')
  async login(@Body() userLoginDto: LoginInfoDto) {
    return this.authService.login(userLoginDto);
  }

  @ApiOperation({
    summary: '刷新token',
  })
  @Public()
  @Post('refresh')
  async refreshToken(@Body() dto: JwtRefreshTokenDto): Promise<LoginToken> {
    return this.authService.refresh(dto);
  }
  @ApiOperation({
    summary: '用户登出',
  })
  @Get('logout')
  public async logout(@Body() dto: JwtLogoutDto): Promise<boolean> {
    await this.authService.delete(dto);
    return true;
  }

  // @ApiOperation({
  //   summary: '用户注册',
  //   deprecated: true,
  // })
  // @Get('signup')
  // public async signup(@Body() dto: LoginInfoDto): Promise<LoginToken> {
  //   const userEntity = await this.userService.getOrCreateUser(dto);
  //   return this.authService.loginUser(userEntity);
  // }
}
