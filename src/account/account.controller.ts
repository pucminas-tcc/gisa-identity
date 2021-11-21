import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Account } from '@prisma/client';
import { AccountService } from './account.service';

@Controller()
export class AccountController {
  private readonly logger = new Logger(AccountController.name);

  constructor(private readonly accountService: AccountService) {}

  @MessagePattern({ cmd: 'create' })
  create(payload: any): Promise<Account> {
    this.logger.log(payload);
    return this.accountService.create(payload);
  }

  @MessagePattern({ cmd: 'update' })
  update(payload: any) {
    const { id } = payload;
    return this.accountService.update({ where: { id }, data: payload });
  }

  @MessagePattern({ cmd: 'remove' })
  remove(payload: any) {
    const { id } = payload;
    return this.accountService.delete({ id });
  }

  @MessagePattern({ cmd: 'validate' })
  validate(payload: any) {
    return this.accountService.validate(payload);
  }
}
