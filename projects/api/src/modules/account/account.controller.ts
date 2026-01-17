import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { OptionalAuthGuard } from '../../shared/guards';
import { CurrentUser, JwtPayload } from '../../shared/decorators';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(OptionalAuthGuard)
  async changePassword(
    @Body() dto: ChangePasswordDto,
    @CurrentUser() user: JwtPayload | null,
  ) {
    return this.accountService.changePassword(dto, user?.id);
  }
}
