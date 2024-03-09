import { Controller, Get } from "@nestjs/common";
import { UserCardsService } from "../services/user-cards.service";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller('user-cards')
export class UserCardsController {
    constructor(private userCardsService: UserCardsService) {
    }


    @ApiOperation({summary: 'Добавить вручную пользователю карточки в сводной таблице'})
    @ApiResponse({status: 200})
    @Get('/add-cards')
    async addCard() {
        return this.userCardsService.addCardsToUsers()
    }


}