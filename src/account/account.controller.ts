import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Account } from '@prisma/client';
import { AccountService } from './account.service';

@Controller()
export class AccountController {
  private readonly logger = new Logger(AccountController.name);

  constructor(private readonly accountService: AccountService) {}

  @MessagePattern({ cmd: 'account.create' })
  private create(payload: any): Promise<Account> {
    this.logger.log(payload);
    return this.accountService.create(payload);
  }

  @MessagePattern({ cmd: 'account.update' })
  private update(payload: any) {
    const { id } = payload;
    return this.accountService.update({ where: { id }, data: payload });
  }

  @MessagePattern({ cmd: 'account.remove' })
  private remove(payload: any) {
    const { id } = payload;
    return this.accountService.delete({ id });
  }

  @MessagePattern({ cmd: 'account.list' })
  private list(payload: any) {
    const { id } = payload;
    return this.accountService.account({ id });
  }

  @MessagePattern({ cmd: 'account.all' })
  private all(payload: any) {
    return this.accountService.accounts(payload);
  }

  @MessagePattern({ cmd: 'validate' })
  private validate(payload: any) {
    return this.accountService.validate(payload);
  }
}
