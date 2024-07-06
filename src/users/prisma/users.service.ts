import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { createHash } from 'crypto';
import { PrismaUserWithRelationsInclude } from 'src/lib/const';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { PrismaCreateUser, PrismaUpdateUser, PrismaUserWithAge, PrismaUserWithRelations } from 'src/lib/types';

@Injectable()
export class UsersService {
  public constructor(private prisma: PrismaService) {}

  public async create(data: PrismaCreateUser): Promise<PrismaUserWithRelations> {
    const now = new Date();
    if (data.userInfo.create.birthYear > now.getFullYear()) {
      throw new BadRequestException('Birth year must be less than or equal to the current year');
    }

    const hashPassword = createHash('sha256').update(data.password).digest('hex');
    data.password = hashPassword;
    return await this.prisma.user.create({ data, include: PrismaUserWithRelationsInclude });
  }

  public async update(id: number, data: PrismaUpdateUser): Promise<PrismaUserWithRelations> {
    return await this.prisma.user.update({ where: { id }, data, include: PrismaUserWithRelationsInclude });
  }

  public async findAll() {
    return await this.prisma.user.findMany();
  }

  public async findOne(id: number): Promise<PrismaUserWithAge> {
    const result = await this.prisma.user.findUnique({
      where: { id },
      include: PrismaUserWithRelationsInclude,
    });
    if (!result) {
      throw new NotFoundException('User not found');
    }

    // Don't return birthYear but return age
    const age = new Date().getFullYear() - result.userInfo.birthYear;
    const userInfo = { ...result.userInfo } as Partial<PrismaUserWithRelations['userInfo']>;
    delete userInfo.birthYear;

    return { ...result, userInfo: { ...userInfo, age } } as PrismaUserWithAge;
  }
}
