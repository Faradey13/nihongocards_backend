import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { CardsService } from "./cards.service";
import { Card } from "./cards.model";
import { UpdateCardDto } from "../user-cards/update-card.dto";


@Resolver('cards')
export class CardsResolver {
    constructor(
      private cardService: CardsService
    ) {}

    @Mutation(() => Card)
    async updateCards(@Args('update') dto: UpdateCardDto) {
        return this.cardService.updateCard(dto)
    }

    @Mutation(() => Card)
    async delCard(@Args('del') word: string) {
        return this.cardService.removeCard(word)
    }

}