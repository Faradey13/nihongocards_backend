import { Module } from '@nestjs/common';
import { MailService } from '../services/mail.service';
import { PugAdapter } from "@nestjs-modules/mailer/dist/adapters/pug.adapter";
import { MailerModule } from "@nestjs-modules/mailer";


@Module({
  providers: [MailService],
  imports:[MailerModule.forRootAsync({
    useFactory: () => ({
      transport: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,

        }
      },
      // defaults: {
      //   from: '"nest-modules" <modules@nestjs.com>',
      // },
      // template: {
      //   dir: __dirname + '/templates',
      //   adapter: new PugAdapter(),
      //   options: {
      //     strict: true,
      //   },
      // },
    }),
  }),],
  exports: [MailService]
})
export class MailModule {}
