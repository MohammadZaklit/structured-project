import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { DatabaseService } from '../../shared/database/database.service';
import { SupabaseService } from '../../infrastructure/supabase/supabase.service';
import { MailerService } from '../../infrastructure/messaging/mailer.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private authProvider: string;

  constructor(
    private databaseService: DatabaseService,
    private supabaseService: SupabaseService,
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {
    this.authProvider = this.configService.get<string>('authProvider') || 'custom';
  }

  private get db() {
    return this.databaseService.db;
  }

  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto;

    if (this.authProvider === 'supabase' && this.supabaseService.client) {
      const { data, error } =
        await this.supabaseService.client.auth.admin.createUser({
          email,
          password,
          user_metadata: { name },
        });

      if (error) throw new BadRequestException(error.message);
      return { user: data.user };
    }

    const exists = await this.db('users').where({ email }).first();
    if (exists) {
      throw new ConflictException('Email already registered');
    }

    const hashed = await bcrypt.hash(password, 10);
    await this.db('users').insert({ name, email, password: hashed });

    return { message: 'User registered' };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    if (this.authProvider === 'supabase' && this.supabaseService.client) {
      const { data, error } =
        await this.supabaseService.client.auth.signInWithPassword({
          email,
          password,
        });

      if (error) throw new UnauthorizedException(error.message);
      return data;
    }

    const user = await this.db('users').where({ email }).first();
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const secret = this.configService.get<string>('jwt.secret');
    if (!secret) {
      throw new UnauthorizedException('JWT secret not configured');
    }
    const token = jwt.sign({ id: user.id }, secret, { expiresIn: '7d' });

    return { token, user: { id: user.id, name: user.name, email: user.email } };
  }

  async requestResetPassword(email: string) {
    if (this.authProvider === 'supabase' && this.supabaseService.client) {
      const appUrl = this.configService.get<string>('app.url');
      const { error } =
        await this.supabaseService.client.auth.resetPasswordForEmail(email, {
          redirectTo: `${appUrl}/reset-password`,
        });

      if (error) throw new BadRequestException(error.message);
      return { message: 'Email sent' };
    }

    const user = await this.db('users').where({ email }).first();
    if (!user) {
      // Prevent email enumeration
      return { message: 'Email sent' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 1000 * 60 * 60; // 1 hour

    await this.db('users').where({ id: user.id }).update({
      reset_password_token: token,
      reset_password_expires: expires,
    });

    const appUrl = this.configService.get<string>('app.url');
    const link = `${appUrl}/auth/reset-password?token=${token}`;

    // Uncomment to send email
    // await this.mailerService.sendMail({
    //   to: email,
    //   subject: 'Reset Password',
    //   html: `<p>You requested a password reset.</p><a href="${link}">Reset your password</a>`,
    // });

    return { message: 'Reset email sent', link };
  }

  async resetPassword(token: string, password: string) {
    if (this.authProvider === 'supabase' && this.supabaseService.client) {
      const { error } =
        await this.supabaseService.client.auth.updateUser({ password });
      if (error) throw new BadRequestException(error.message);
      return { message: 'Password updated' };
    }

    const user = await this.db('users')
      .where('reset_password_token', token)
      .andWhere('reset_password_expires', '>', Date.now())
      .first();

    if (!user) {
      throw new BadRequestException('Invalid or expired token');
    }

    const hashed = await bcrypt.hash(password, 10);

    await this.db('users').where({ id: user.id }).update({
      password: hashed,
      reset_password_token: null,
      reset_password_expires: null,
    });

    return { message: 'Password reset successful' };
  }

  async validateResetToken(resetToken: string) {
    if (!resetToken) {
      throw new BadRequestException('Reset token is required');
    }

    const user = await this.db('users')
      .where('reset_password_token', resetToken)
      .andWhere('reset_password_expires', '>', Date.now())
      .first();

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    return { status: true };
  }
}
