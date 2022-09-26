import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, FindOptionsWhere, Repository } from 'typeorm';
import { nanoid } from 'nanoid';
import { LoginInfoDto } from '@/modules/auth/dto/login.dto';
import { UserService } from '@/modules/user/user.service';
import { UserEntity } from '@/entities/user.entity';
import { AuthEntity } from '@/entities/auth.entity';
import {
  accessTokenExpiresIn,
  refreshTokenExpiresIn,
} from '@/modules/auth/auth.constants';
import { LoginToken } from '@/modules/auth/auth.class';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly authEntityRepository: Repository<AuthEntity>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

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
      throw new UnauthorizedException();
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
    });

    if (
      !authEntity ||
      authEntity.refreshTokenExpiresAt < new Date().getTime()
    ) {
      throw new UnauthorizedException();
    }

    return this.loginUser(authEntity.user, String(where.refreshToken));
  }

  async loginUser(
    userEntity: UserEntity,
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

    console.log('userEntity', userEntity);
    const date = new Date();

    const result = {
      accessToken: this.jwtService.sign(
        { userId: userEntity.id },
        { expiresIn: accessTokenExpiresIn / 1000 },
      ),
      refreshToken: nanoid(),
      accessTokenExpiresAt: date.getTime() + accessTokenExpiresIn,
      refreshTokenExpiresAt: date.getTime() + refreshTokenExpiresIn,
    };
    await this.authEntityRepository
      .create({
        ...result,
        user: userEntity,
      })
      .save();

    return result;
  }
}
