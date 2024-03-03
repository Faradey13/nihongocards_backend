import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { UserCards } from "../models/user-cards.model";
import { GetCardDto } from "../dto/getCard.dto";
import { UserCardsService } from "./user-cards.service";
import { CurrentLessonCards } from "../models/currentLessonCards.model";
import * as process from "process";
import { RateCardDto } from "../dto/rateCard.dto";
import { User } from "../models/users.model";
import { Card } from "../models/cards.model";
import { Op } from "sequelize";


@Injectable()
export class CurrentLessonCardsService {

    constructor(
      @InjectModel(CurrentLessonCards) private currentLessonRepository: typeof CurrentLessonCards,
      @InjectModel(UserCards) private userCardsRepository: typeof UserCards,
      @InjectModel(User) private userRepository: typeof User,
      @InjectModel(Card) private cardRepository: typeof Card,
      private userCardsService: UserCardsService
    ) {
    }

    async fillPosition(userId: number) {
        const userCards = await this.currentLessonRepository.findAll({ where: { userId: userId } });
        await Promise.all(userCards.map(async (card, index) => {
            card.position = index + 1;
            await card.save();
        }));

    }

    async fillData(userId: number) {
        const userCards = await this.currentLessonRepository.findAll({ where: { userId: userId } });
        await Promise.all(userCards.map(async (card) => {
            card.currentLessonData = new Date();
            await card.save();
        }));


    }


    async startNewLesson(dto: GetCardDto) {
        await this.currentLessonRepository.destroy({ where: {} });
        const today = (new Date());
        if (await this.currentLessonRepository.count() > 0) {
            const checkDate = await this.currentLessonRepository.findOne({ where: { userId: dto.userId } });
            if (checkDate) {
                const lastLessonCard = checkDate.currentLessonData;
                if (today.getTime() - lastLessonCard.getTime() > 24) {
                    await this.currentLessonRepository.destroy({
                        where: {
                            userId: dto.userId
                        }
                    }).then(numRows => {
                        console.log(`Удалено ${numRows} записей`);
                    }).catch(error => {
                        console.error("Ошибка удаления записей:", error);
                    });
                }
            }
        }

        const cardsForLearn = await this.userCardsService.getCards(dto);

        const userCardIds = cardsForLearn.map(card => card.id);

        const userCardsForLearn = await this.userCardsRepository.findAll({
            where: {
                cardId: userCardIds,
                userId: dto.userId
            }
        });

        const cardsFromCards = await this.cardRepository.findAll({
            where: {
                id: userCardIds
            }
        });

        try {
            const unitedCards = [];
            userCardsForLearn.forEach(cardU => {
                const correspondingCard = cardsFromCards.find(card => card.id === cardU.cardId);
                if (correspondingCard) {
                    unitedCards.push({
                        UserCardsId: cardU.id,
                        cardId: correspondingCard.id,
                        userId: cardU.userId,
                        word: correspondingCard.word,
                        translation: correspondingCard.translation,
                        example: correspondingCard.example,
                        category: correspondingCard.category,
                        difficulty: correspondingCard.difficulty,
                        image: correspondingCard.image,
                        audio: correspondingCard.audio,
                        repetitionNumber: cardU.repetitionNumber,
                        repetitionCount: 0,
                        totalRepetitionCount: cardU.totalRepetitionCount,
                        grade: 0,
                        isNew: cardU.isNew,
                        isHard: cardU.isHard,
                        position: null,
                        currentLessonData: new Date()
                    });
                }
            });


            await this.currentLessonRepository.bulkCreate(unitedCards);
            await this.fillPosition(dto.userId);
            // await this.fillData(dto.userId);

        } catch (e) {
            throw new HttpException(`Ошибка загрузки урока: ${e.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    async getFirstCard(userID: number) {
        return await this.currentLessonRepository.findOne({ where: { position: 1, userId: userID } });
    }


    async updateCard(dto: RateCardDto) {

        const cardFromUser = await this.currentLessonRepository.findOne({
            where: {
                cardId: dto.cardId,
                userId: dto.userId
            }
        });
        cardFromUser.grade = cardFromUser.grade+dto.grade;
        cardFromUser.repetitionCount++;
        cardFromUser.totalRepetitionCount++;
        await cardFromUser.save();
        console.log(cardFromUser.repetitionNumber);
        console.log(cardFromUser.grade);
        console.log(cardFromUser.repetitionCount);


        let showAgain = false;
        if (cardFromUser.repetitionNumber === 0) {
            if (dto.grade < 3) {
                cardFromUser.repetitionCount = 0;
                await cardFromUser.save();
            }
            if (dto.grade < 5 || cardFromUser.repetitionCount < 2) {
                showAgain = true;


            }
        }
        if (cardFromUser.repetitionNumber > 0) {
            if (dto.grade < 3) {
                cardFromUser.isHard = true;
                cardFromUser.repetitionCount = 0;
                await cardFromUser.save();
            }
            if (dto.grade < 5 && cardFromUser.repetitionCount < 1) {
                showAgain = true;

            }
        }
        console.log(showAgain);

        return await this.decideLastStep(showAgain, cardFromUser);

    }

    async decideLastStep(showAgain: boolean, cardFromUser: CurrentLessonCards) {
        if (showAgain) {
            return this.changeCardPosition(cardFromUser);
        } else {
            if (cardFromUser.isNew) {
                cardFromUser.isNew = false;
                await cardFromUser.save();
            }
            cardFromUser.repetitionNumber++;
            cardFromUser.grade = cardFromUser.grade / cardFromUser.repetitionCount;
            await cardFromUser.save();
            const userCardId = cardFromUser.UserCardsId;
            const updatingCard = await this.userCardsRepository.findOne({ where: { id: userCardId } });
            console.log(`до обновления ${updatingCard}`);
            console.log(updatingCard);


            await updatingCard.update({
                grade: cardFromUser.grade,
                isHard: cardFromUser.isHard,
                isNew: cardFromUser.isNew,
                totalRepetitionCount: cardFromUser.totalRepetitionCount,
                repetitionNumber: cardFromUser.repetitionNumber
            });
            console.log(`после обновления ${updatingCard}`);
            console.log(updatingCard);
            console.log(cardFromUser);
            await this.destroyCard(cardFromUser);
            return this.userCardsService.calculateCards(userCardId);
        }
    }


    async changeCardPosition(cardForRepeat: CurrentLessonCards) {
        const remainsCards = await this.currentLessonRepository.findAll({where:{
            id:{[Op.ne]: cardForRepeat.id}
            }})
        const targetPosition = await this.currentLessonRepository.findAll({
            where: {
                position: { [Op.lte]: Number(process.env.POSITION_FOR_REPEAT) },
                id: { [Op.ne]: cardForRepeat.id }
            },
            order: [["position", "ASC"]]
        });

        if (await this.currentLessonRepository.count() > 7) {
            await cardForRepeat.update({ position: null });
            for (const card of targetPosition) {
                await card.update({ position: card.position - 1 });
            }

            await cardForRepeat.update({ position: Number(process.env.POSITION_FOR_REPEAT) });
        } else {
            for (const card of remainsCards) {
                await card.update({ position: card.position - 1 });
            }
            await cardForRepeat.update({ position: await this.currentLessonRepository.count()});
        }
    }


    async destroyCard(cardForRemove: CurrentLessonCards) {
        const cardsToMove = await this.currentLessonRepository.findAll({
            where: {
                position: { [Op.gt]: 1 },
                id: { [Op.ne]: cardForRemove.id }
            },
            order: [["position", "ASC"]]
        });
        await cardForRemove.destroy();
        for (const card of cardsToMove) {
            await card.update({ position: card.position - 1 });
        }
    }
}