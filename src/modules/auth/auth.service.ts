import {
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ModuleRef } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DeleteResult, FindOptionsWhere, Repository } from 'typeorm';
import { nanoid } from 'nanoid';
import { LoginInfoDto } from '@/modules/auth/dto/login.dto';
import { UserService } from '@/modules/user/user.service';
import { AuthEntity } from '@/entities/auth.entity';
import {
  accessTokenExpiresIn,
  refreshTokenExpiresIn,
} from '@/modules/auth/auth.constants';
import { LoginToken } from '@/modules/auth/auth.class';
import { UserLoginResultDto } from '@/modules/user/user.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  private userService: UserService;
  constructor(
    @InjectRepository(AuthEntity)
    private readonly authEntityRepository: Repository<AuthEntity>,
    private readonly jwtService: JwtService,
    private moduleRef: ModuleRef,
    private readonly config: ConfigService,
  ) {}
  onModuleInit() {
    this.userService = this.moduleRef.get(UserService, { strict: false });
  }
  // async validateUser(username: string, password: string): Promise<any> {
  //   const user = await this.usersService.findOne({ username, password });
  //   if (user && (await bcrypt.compare(password, user.password))) {
  //     Reflect.deleteProperty(user, 'password');
  //     return user;
  //   }
  //   return null;
  // }

  async login(dto: LoginInfoDto): Promise<LoginToken> {
    const userEntity = await this.userService.getByCredentials(
      dto.username,
      dto.password,
    );

    if (!userEntity) {
      throw new UnauthorizedException('用户不存在');
    }

    return this.loginUser(userEntity);
  }

  async findOne(where: FindOptionsWhere<AuthEntity>): Promise<AuthEntity> {
    return this.authEntityRepository.findOne({ where });
  }

  async delete(where: FindOptionsWhere<AuthEntity>): Promise<DeleteResult> {
    return this.authEntityRepository.delete(where);
  }

  async refresh(where: FindOptionsWhere<AuthEntity>): Promise<LoginToken> {
    const authEntity = await this.authEntityRepository.findOne({
      where,
      relations: ['user'],
      select: {
        user: { id: true, passwordVersion: true, password: true },
      },
    });

    if (
      !authEntity ||
      authEntity.refreshTokenExpiresAt < new Date().getTime()
    ) {
      throw new UnauthorizedException('token已失效，请重新登录');
    }
    return this.loginUser(
      {
        ...authEntity.user,
        isFirstLogin: false,
      },
      String(where.refreshToken),
    );
  }

  async loginUser(
    userEntity: UserLoginResultDto,
    refreshToken = '',
  ): Promise<LoginToken> {
    if (refreshToken) {
      const isRefresh = await this.authEntityRepository.findOne({
        where: { refreshToken },
      });
      if (isRefresh) {
        await this.authEntityRepository.delete({ refreshToken });
      }
    }

    const date = new Date();

    const result = {
      accessToken: this.jwtService.sign(
        { userId: userEntity.id, pv: userEntity.passwordVersion },
        {
          expiresIn: accessTokenExpiresIn / 1000,
          secret: this.config.get<string>('jwt.secret'),
        },
      ),
      refreshToken: nanoid(),
      accessTokenExpiresAt: date.getTime() + accessTokenExpiresIn,
      refreshTokenExpiresAt: date.getTime() + refreshTokenExpiresIn,
      isFirstLogin: userEntity.isFirstLogin,
    };
    await this.authEntityRepository
      .create({
        ...result,
        user: userEntity,
      })
      .save();

    userEntity.lastLoginTime = new Date();

    this.userService.updateUser(userEntity);

    return result;
  }
}
