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
import { validate } from 'class-validator';
import { nanoid } from 'nanoid';
import {
  UpdateUserInfoDto,
  UpdateUserPasswordDto,
  UserLoginDto,
  UserLoginResultDto,
} from './user.dto';
import { UserEntity } from '@/entities/user.entity';
import { UtilService } from '@/shared/services/util.service';
import { AuthService } from '@/modules/auth/auth.service';
import { LoginToken } from '@/modules/auth/auth.class';
import { WorkspaceService } from '@/modules/workspace/workspace.service';
import { ProjectService } from '@/modules/workspace/project/project.service';

@Injectable()
export class UserService implements OnModuleInit {
  private authService: AuthService;
  private workspaceService: WorkspaceService;
  private projectService: ProjectService;
  constructor(
    private utils: UtilService,
    private moduleRef: ModuleRef,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  onModuleInit() {
    this.authService = this.moduleRef.get(AuthService, { strict: false });
    this.workspaceService = this.moduleRef.get(WorkspaceService, {
      strict: false,
    });
    this.projectService = this.moduleRef.get(ProjectService, {
      strict: false,
    });
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
  ): Promise<UserLoginResultDto | null> {
    // return this.userRepository.findOne({
    //   where: {
    //     username,
    //     password: await this.createPasswordHash(password),
    //   },
    // });
    return this.getOrCreateUser({ username, password });
  }

  validateUser(userDto: Partial<UserEntity>) {
    const userValidator = new UserEntity();
    userValidator.email = userDto.username;
    userValidator.mobilePhone = userDto.username;

    return validate(userValidator).then((errors) => {
      const result = {} as UserEntity;
      const validateFields = errors.map((n) => n.property);
      if (!validateFields.includes('email')) {
        result.email = userDto.username;
      }
      if (!validateFields.includes('mobilePhone')) {
        result.mobilePhone = userDto.username;
      }
      return result;
    });
  }

  async getOrCreateUser(userDto: UserLoginDto): Promise<UserLoginResultDto> {
    const user = await this.userRepository.findOne({
      where: [
        { username: Equal(userDto.username) },
        { email: Equal(userDto.username) },
        { mobilePhone: Equal(userDto.username) },
      ],
      select: ['id', 'username', 'password', 'avatar', 'passwordVersion'],
    });
    if (user) {
      if (this.utils.md5(userDto.password) === user.password) {
        return {
          ...user,
          isFirstLogin: false,
        };
      } else {
        throw new ForbiddenException('密码错误');
      }
    } else {
      const other = await this.validateUser(userDto);
      if (Object.keys(other).length === 0) {
        throw new Error('用户名必须是手机号码或邮箱');
      }
      const user = await this.userRepository.save({
        ...other,
        ...userDto,
        password: this.utils.md5(userDto.password),
      });
      this.userRepository.update(user.id, { username: `user_${nanoid(10)}` });
      if (user.id === 1) {
        const defaultProject = await this.projectService.findOneBy(1);
        if (defaultProject) {
          this.workspaceService.create(
            user.id,
            {
              title: '默认空间',
            },
            defaultProject,
          );
        }
      }

      return {
        ...user,
        isFirstLogin: true,
      };
    }
  }

  async searchUsers(username: string) {
    const [result] = await this.userRepository.findAndCount({
      where: [
        { username: Like(`%${username}%`) },
        { email: Like(`%${username}%`) },
        { mobilePhone: Like(`%${username}%`) },
      ],
    });
    return result;
  }

  async updateUserProfile(
    userId,
    userInfoDto: UpdateUserInfoDto,
  ): Promise<UserEntity> {
    // const other = await this.validateUser(userInfoDto);
    // if (userInfoDto.username && Object.keys(other).length === 0) {
    //   throw new Error('用户名必须是手机号码或邮箱');
    // }
    const isConflict = await this.userRepository.findOne({
      where: { username: Equal(userInfoDto.username), id: Not(userId) },
    });
    if (isConflict) {
      throw new ConflictException('用户名已存在');
    }
    Reflect.deleteProperty(userInfoDto, 'password');
    await this.userRepository.update(userId, {
      username: userInfoDto.username,
    });
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
    return this.authService.loginUser({
      ...userInfo,
      isFirstLogin: false,
    });
  }
}
