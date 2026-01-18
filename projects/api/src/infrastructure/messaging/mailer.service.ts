import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

export interface SendMailOptions {
  to: string;
  subject?: string;
  html?: string;
}

@Injectable()
export class MailerService implements OnModuleInit {
  private transporter!: Transporter;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('mailer.host'),
      port: this.configService.get<number>('mailer.port'),
      secure: false,
      auth: {
        user: this.configService.get<string>('mailer.user'),
        pass: this.configService.get<string>('mailer.pass'),
      },
    });
  }

  async sendMail({
    to,
    subject = 'test',
    html = 'HELLO',
  }: SendMailOptions): Promise<any> {
    const from = this.configService.get<string>('mailer.from');

    return this.transporter.sendMail({
      from: `"Auth System" <${from}>`,
      to,
      subject,
      html,
    });
  }
}
