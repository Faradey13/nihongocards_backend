import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Card } from "../models/cards.model";
import { InjectModel } from "@nestjs/sequelize";
import { UserCards } from "../models/user-cards.model";
import { GetCardDto } from "../dto/getCard.dto";
import { User } from "../models/users.model";
import { Op } from "sequelize";
import { Sequelize } from "sequelize-typescript";

@Injectable()
export class UserCardsService {
    constructor(
      @InjectModel(Card) private cardsRepository: typeof Card,
      @InjectModel(User) private usersRepository: typeof User,
      @InjectModel(UserCards) private userCardsRepository: typeof UserCards
    ) {
    }

    async addCardsToUsers(){
        try {
            const cards = await this.cardsRepository.findAll();
            const users = await this.usersRepository.findAll()

            const userCardData = []
            users.forEach(user => {
                cards.forEach(card => {
                    userCardData.push({
                        userId: user.id,
                        cardId: card.id
                    })
                })
            })
            const userCards = userCardData.map(data => this.userCardsRepository.build(data));
            await Promise.all(userCards.map(userCard => {
                if(!userCard.cardId && !userCard.userId){
                    userCard.save();
                } else {
                    console.log(`пара карта ${userCard.cardId} и пользователь ${userCard.userId} уже существует, пропуск`)
                }

            }));

            return { success: true, message: 'Карты успешно добавлены пользователям' };

        } catch (e) {
            throw new HttpException(`Ошибка: ${e.message}`, HttpStatus.INTERNAL_SERVER_ERROR );
        }
    }
    async calculateCards(id: number) {
        const currentCard = await this.userCardsRepository.findByPk(id);
        const grade = currentCard.grade

        if (!currentCard) {
            throw new Error(`Карточка с id ${id} не найдена`);
        }
        if (grade < 0 || grade > 5) {
            console.error("Оценка должна быть в диапазоне от 0 до 5");
            return;
        }
        if (grade >= 3) {
            if (currentCard.repetitionNumber === 0) {
                currentCard.interval = 1;
            } else if (currentCard.interval === 1) {
                currentCard.interval = 3;
            } else {
                currentCard.factorOfEasiness = Math.max(Number(process.env.MAX_FOE), currentCard.factorOfEasiness + (Number(process.env.GRADE_MULTIPLIER) - (5 - grade) * (Number(process.env.GRADE_MULTIPLIER) + (5 - grade) * Number(process.env.GRADE_FACTOR_MULTIPLIER))));
                currentCard.interval = Math.round(currentCard.interval * currentCard.factorOfEasiness);
            }
            currentCard.repetitionNumber++;
        } else {
            currentCard.repetitionNumber = 0;
            currentCard.interval = 1;

        }
        const today = new Date();
        currentCard.lastRepetition = today;
        currentCard.nextRepetition = (new Date(today.setDate(today.getDate() + currentCard.interval)))
        await currentCard.save();
        return currentCard;
    };


    async getCards(dto: GetCardDto) {
        const today = new Date();
        const formattedToday = today.toISOString().split("T")[0];

        const newCards = await this.userCardsRepository.findAll({
            where: {
                userId: dto.userId,
                isNew: true,
                category: dto.category || undefined

            },
            limit: dto.newLimit
        });
        const repetitionCards = await this.userCardsRepository.findAll(({
            where: {
                userId: dto.userId,
                nextRepetition:  {
                    [Op.gte] : Sequelize.literal('DATE_NOW'),
                    [Op.lt] : Sequelize.literal('DATE_NOW + INTERVAL 1 DAY')
                }
            },
            limit: dto.limit
        }));

        const cardIds = new Set([
            ...newCards.map((userCard) => userCard.cardId),
            ...repetitionCards.map((userCard) => userCard.cardId)
        ]);

        return await this.cardsRepository.findAll({
            where: {
                id: Array.from(cardIds)
            }
        });
    };

    async refreshProgress(userId: number){
        await this.userCardsRepository.update({
            factorOfEasiness: 2.5,
            interval: 0,
            repetitionNumber: 0,
            repetitionCount: 0,
            totalRepetitionCount: 0,
            grade: 0,
            lastRepetition: null,
            isNew: true

        },{where:{userId: userId}})
    }
}

