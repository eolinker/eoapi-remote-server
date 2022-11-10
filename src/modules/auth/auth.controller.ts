import { Body, Controller, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from '@/common/decorators/public.decorator';
import { LoginInfoDto } from '@/modules/auth/dto/login.dto';
import { LoginToken } from '@/modules/auth/auth.class';
import { JwtLogoutDto, JwtRefreshTokenDto } from '@/modules/auth/dto';
import { ApiOkResponseData } from '@/common/class/res.class';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '用户登录/注册',
  })
  @ApiOkResponseData(LoginToken)
  @ApiOkResponseData(LoginToken, 'object', { status: 201 })
  @Public()
  @Post('login')
  async login(@Body() userLoginDto: LoginInfoDto) {
    return this.authService.login(userLoginDto);
  }

  @ApiOperation({
    summary: '刷新token',
  })
  @ApiOkResponseData(LoginToken)
  @Public()
  @Put('refresh')
  async refreshToken(@Body() dto: JwtRefreshTokenDto): Promise<LoginToken> {
    return this.authService.refresh(dto);
  }
  @ApiOperation({
    summary: '用户登出',
  })
  @Post('logout')
  public async logout(@Body() dto: JwtLogoutDto): Promise<boolean> {
    await this.authService.delete(dto);
    return true;
  }
}
