import { Body, Controller, Post } from "@nestjs/common";
import { UserCardsService } from "../services/user-cards.service";

import { Card } from "../models/cards.model";
import { CalculateCardsDto } from "../dto/calculate-cards.dto";
import { UserCards } from "../models/user-cards.model";
import { GetCardDto } from "../dto/getCard.dto";

@Controller('user-cards')
export class UserCardsController {
    constructor(private userCardsService: UserCardsService) {
    }


    @Post('/:id')
      async updateCard(@Body() dto: CalculateCardsDto): Promise<UserCards> {
        return this.userCardsService.calculateCards(dto)
    }

    @Post(':userId/cards')
    async getCardsByParams(@Body() dto: GetCardDto): Promise<Card[]> {
        return this.userCardsService.getCards(dto)

    }
    //
    // @Post(':userId/cards/:category')
    // async getCardsByCategory(@Body() dto: UserCardsDto): Promise<Card[]> {
    //     return this.userCardsService.getCardsByCategory(dto)
    //
    //
    // }
}