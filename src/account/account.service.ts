import { Injectable, Logger } from '@nestjs/common';
import { Account, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { hash, verify } from 'src/utils/hash';

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.AccountCreateInput): Promise<Account> {
    const { password } = data;
    const hashed_password = await hash(password);

    data = {
      ...data,
      password: hashed_password,
    };

    return this.prisma.account.create({
      data,
    });
  }

  async account(accountWhereUniqueInput: Prisma.AccountWhereUniqueInput) {
    return this.prisma.account.findUnique({
      where: accountWhereUniqueInput,
      select: { password: true, id: true, email: true },
    });
  }

  async accounts(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AccountWhereUniqueInput;
    where?: Prisma.AccountWhereInput;
    orderBy?: Prisma.AccountOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.account.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select: { password: false, id: true, email: true },
    });
  }

  async update(params: {
    where: Prisma.AccountWhereUniqueInput;
    data: Prisma.AccountUpdateInput;
  }) {
    const { where, data } = params;

    if (data.password) {
      data.password = await hash(data.password);
    }

    return this.prisma.account.update({
      data,
      where,
      select: { password: false, id: true, email: true },
    });
  }

  async delete(where: Prisma.AccountWhereUniqueInput) {
    return this.prisma.account.delete({
      where,
      select: { password: false, id: true, email: true },
    });
  }

  async validate(
    accountWhereInput: Prisma.AccountWhereInput,
  ): Promise<boolean> {
    this.logger.log(accountWhereInput);
    const { email, password } = accountWhereInput;

    const result = await this.prisma.account.findFirst({
      where: { email },
    });

    if (result == null) {
      this.logger.log('Result is null');
      return false;
    }

    const password_match = await verify(password, result.password);

    if (!password_match) {
      this.logger.log("Password didn't match");
      return false;
    }

    this.logger.log('All good');
    return true;
  }
}
