import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';

@Injectable()
export class UsersService {
  public constructor(private prisma: PrismaService) {}
}
