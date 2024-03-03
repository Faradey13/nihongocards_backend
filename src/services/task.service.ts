import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { TokenService } from "./token.service";


@Injectable()
export class TaskService {
    constructor(private tokenService: TokenService) {
    }



    @Cron('0 0,12 * * *')
    async tokenTask() {
        await this.tokenService.removeOldToken()
    }
}