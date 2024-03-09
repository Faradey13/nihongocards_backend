import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { TokenService } from "./token.service";


@Injectable()
export class TaskService {
    constructor(private tokenService: TokenService) {
    }

    private readonly logger = new Logger(TaskService.name);


    @Cron(CronExpression.EVERY_12_HOURS)
    async tokenTask() {
        this.logger.debug('Called when the current second is 12h');
        await this.tokenService.removeOldToken()
    }
}