import { Controller, Get } from "@nestjs/common";
import { UserCardsService } from "../services/user-cards.service";

@Controller('user-cards')
export class UserCardsController {
    constructor(private userCardsService: UserCardsService) {
    }


    @Get('/add-cards')
    async addCard() {
        return this.userCardsService.addCardsToUsers()
    }


}