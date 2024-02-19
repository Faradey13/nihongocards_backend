import { Injectable } from '@nestjs/common';
import { Card } from "../models/cards.model";
import { InjectModel } from "@nestjs/sequelize";
import { UserCards } from "../models/user-cards.model";
import { CalculateCardsDto } from "../dto/calculate-cards.dto";
import { GetCardDto } from "../dto/getCard.dto";

@Injectable()
export class UserCardsService {
    constructor(
      @InjectModel(Card) private cardsRepository: typeof Card,
      private userCardsRepository: typeof UserCards
    ) {}

    async calculateCards(dto: CalculateCardsDto) {
        const currentCard = await this.userCardsRepository.findByPk(dto.id);
        if (!currentCard) {
            throw new Error(`Карточка с id ${dto.id} не найдена`);
        }
        if(dto.grade < 0 || dto.grade >5) {
            console.error('Оценка должна быть в диапазоне от 0 до 5');
            return;
        }
        if(dto.grade >= 3) {
            if(currentCard.repetitionCount === 0){
                currentCard.interval = 1
            } else if (currentCard.interval === 1) {
                currentCard.interval = 3
            }
            else {
                currentCard.factorOfEasiness = Math.max(1.3, currentCard.factorOfEasiness + (0.1 - (5 - dto.grade) * (0.08 + (5 - dto.grade) * 0.02)) );
                currentCard.interval = Math.round(currentCard.interval * currentCard.factorOfEasiness);
            }
            currentCard.repetitionCount ++;
        }
        else {
            currentCard.repetitionCount = 0
            currentCard.interval = 0

        }
        const today = new Date()
        currentCard.nextRepetition = new Date(today.setDate(today.getDate() + currentCard.interval));
        await currentCard.save();
        return currentCard;
    };



    async getCards(dto: GetCardDto) {
        const today = new Date();
        const formattedToday = today.toISOString().split('T')[0];

        const newCards = await this.userCardsRepository.findAll({
            where: {
                UserId: dto.UserId,
                isNew: true,
                category: dto.category || undefined

            },
            limit: dto.newLimit
        });
        const repetitionCards = await this.userCardsRepository.findAll(({
            where: {
                UserId: dto.UserId,
                nextRepetition: formattedToday
            },
            limit: dto.limit
        }));

        const cardIds = new Set([
            ...newCards.map((userCard) => userCard.cardId),
            ...repetitionCards.map((userCard) => userCard.cardId),
        ]);

        return await this.cardsRepository.findAll({
            where: {
                id: Array.from(cardIds)
            }
        })




    };

}
