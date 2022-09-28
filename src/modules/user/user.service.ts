import {
  ConflictException,
  ForbiddenException,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ModuleRef } from '@nestjs/core';
import {
  Equal,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Like,
  Not,
  Repository,
} from 'typeorm';
import {
  UpdateUserInfoDto,
  UpdateUserPasswordDto,
  UserLoginDto,
} from './user.dto';
import { UserEntity } from '@/entities/user.entity';
import { UtilService } from '@/shared/services/util.service';
import { AuthService } from '@/modules/auth/auth.service';
import { LoginToken } from '@/modules/auth/auth.class';

@Injectable()
export class UserService implements OnModuleInit {
  private authService: AuthService;
  constructor(
    private utils: UtilService,
    private moduleRef: ModuleRef,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  onModuleInit() {
    this.authService = this.moduleRef.get(AuthService, { strict: false });
  }

  findOne(options: FindOneOptions<UserEntity>): Promise<UserEntity | null> {
    return this.userRepository.findOne(options);
  }

  findOneBy(where: FindOptionsWhere<UserEntity>): Promise<UserEntity | null> {
    return this.userRepository.findOneBy(where);
  }

  find(where: FindManyOptions<UserEntity>): Promise<UserEntity[] | null> {
    return this.userRepository.find(where);
  }

  findAndCount(
    options: FindManyOptions<UserEntity>,
  ): Promise<[Array<UserEntity>, number]> {
    return this.userRepository.findAndCount(options);
  }

  async getByCredentials(
    username: string,
    password: string,
  ): Promise<UserEntity | null> {
    // return this.userRepository.findOne({
    //   where: {
    //     username,
    //     password: await this.createPasswordHash(password),
    //   },
    // });
    return this.getOrCreateUser({ username, password });
  }

  async getOrCreateUser(userDto: UserLoginDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        username: userDto.username,
      },
      select: ['id', 'username', 'password', 'avatar', 'passwordVersion'],
    });
    if (user) {
      if (this.utils.md5(userDto.password) === user.password) {
        return user;
      } else {
        throw new ForbiddenException('密码错误');
      }
    } else {
      return this.userRepository.save({
        ...userDto,
        password: this.utils.md5(userDto.password),
      });
    }
  }

  async searchUsers(username: string) {
    const [result] = await this.userRepository.findAndCount({
      where: { username: Like(`%${username}%`) },
    });
    return result;
  }

  async updateUserProfile(
    userId,
    userInfoDto: UpdateUserInfoDto,
  ): Promise<UserEntity> {
    const isConflict = await this.userRepository.findOne({
      where: { username: Equal(userInfoDto.username), id: Not(userId) },
    });
    if (isConflict) {
      throw new ConflictException('用户名已存在');
    }
    Reflect.deleteProperty(userInfoDto, 'password');
    await this.userRepository.update(userId, userInfoDto);
    return this.userRepository.findOneBy({ id: userId });
  }

  async updateUserPassword(
    userId,
    userPasswordDto: UpdateUserPasswordDto,
  ): Promise<LoginToken> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['password', 'passwordVersion'],
    });
    if (!user) {
      throw new ConflictException('用户不存在');
    }
    if (!userPasswordDto.newPassword) {
      throw new ConflictException('新密码不能为空');
    }
    const oldPassword = this.utils.md5(userPasswordDto.oldPassword);
    if (oldPassword !== user.password) {
      throw new ForbiddenException('旧密码验证失败');
    }
    await this.userRepository.update(userId, {
      password: this.utils.md5(userPasswordDto.newPassword),
      passwordVersion: user.passwordVersion + 1,
    });
    const userInfo = await this.userRepository.findOneBy({ id: userId });
    userInfo.passwordVersion = user.passwordVersion + 1;
    return this.authService.loginUser(userInfo);
  }
}
