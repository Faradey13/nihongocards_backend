import { Controller, Get, UseGuards } from "@nestjs/common";
import { UserCardsService } from "./user-cards.service";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Roles } from "../util/decorators/roles-auth.decorator";
import { RolesGuard } from "../util/guards/role.guard";

@Controller('user-cards')
export class UserCardsController {
    constructor(private userCardsService: UserCardsService) {
    }


    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @ApiOperation({summary: 'Добавить вручную пользователю карточки в сводной таблице'})
    @ApiResponse({status: 200})
    @Get('/add-cards')
    async addCard() {
        return this.userCardsService.addCardsToUsers()
    }


}