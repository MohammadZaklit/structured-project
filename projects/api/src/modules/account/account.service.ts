import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../../shared/database/database.service';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AccountService {
  constructor(private databaseService: DatabaseService) {}

  private get db() {
    return this.databaseService.db;
  }

  async changePassword(dto: ChangePasswordDto, userId?: number) {
    const { oldPassword, newPassword, isReset, resetToken } = dto;

    if (!newPassword) {
      throw new BadRequestException('newPassword is required');
    }

    // Reset password flow
    if (isReset === true) {
      if (!resetToken) {
        throw new BadRequestException('resetToken is required');
      }

      const user = await this.db('users')
        .where('reset_password_token', resetToken)
        .andWhere('reset_password_expires', '>', Date.now())
        .first();

      if (!user) {
        throw new BadRequestException('Invalid or expired reset token');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this.db('users').where({ id: user.id }).update({
        password: hashedPassword,
        reset_password_token: null,
        reset_password_expires: null,
      });

      return { message: 'Password updated successfully' };
    }

    // Change password flow (requires authentication)
    if (!oldPassword) {
      throw new BadRequestException('oldPassword is required');
    }

    if (!userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    const user = await this.db('users').where({ id: userId }).first();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Old password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.db('users').where({ id: user.id }).update({
      password: hashedPassword,
    });

    return { message: 'Password changed successfully' };
  }
}
