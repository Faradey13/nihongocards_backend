import { Injectable, Logger } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";


@Injectable()


export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor(private readonly mailerService: MailerService) {}

    public async example(to: string, link: string): Promise<void> {
        try {
            this.logger.log(`Sending email to: ${to}`);
            await this.mailerService.sendMail({
                to: to,
                from: 'ikg1366@ya.ru',
                subject: 'Регистрация на сайте NihongoFlashcards', // Subject line
                text: 'Добро пожаловать, нажмите на ссылку для активации вашего акаунта и удачи в обучении', // Plain text body
                html: `
                <div><a href="${link}">${link}</a></div>
                
                `, // HTML body content

            });
            this.logger.log('Email sent successfully');
        } catch (error) {
            this.logger.error(`Error sending email: ${error.message}`);
            throw error; // Re-throwing the error so that it's propagated up the call stack
        }
    }
}
    // async sendActivationMail(to, link){}

