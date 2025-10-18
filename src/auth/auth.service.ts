import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/user/entities/user.entity';
import { User } from 'src/user/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: CreateUserDto) {
    const user: User = this.userRepo.create(dto);
    if (user) await this.userRepo.save(user);
    return {
      access_token: this.jwtService.sign({ id: user.id, tc: user.tc }),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { tc: dto.tc } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid: boolean = await bcrypt.compare(dto.password, user.password);

    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return {
      access_token: this.jwtService.sign({ id: user.id, tc: user.tc }),
    };
  }
}
