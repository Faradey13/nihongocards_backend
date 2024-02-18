import { Body, Controller, Post } from "@nestjs/common";
import { UserCardsService } from "../services/user-cards.service";
import { UserCardsDto } from "../dto/user-cards.dto";
import { Card } from "../models/cards.model";

@Controller('user-cards')
export class UserCardsController {
    constructor(private userCardsService: UserCardsService) {
    }

    @Post(':userId/cards')
    async getCardsByParams(@Body() dto: UserCardsDto): Promise<Card[]> {
        return this.userCardsService.getCardsByParams(dto)

    }

    @Post(':userId/cards/:category')
    async getCardsByCategory(@Body() dto: UserCardsDto): Promise<Card[]> {
        return this.userCardsService.getCardsByCategory(dto)


    }
}