import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { UserCards } from "../models/user-cards.model";
import { GetCardDto } from "../dto/getCard.dto";
import { UserCardsService } from "./user-cards.service";
import { CurrentLessonCards } from "../models/currentLessonCards.model";
import * as process from "process";
import { RateCardDto } from "../dto/rateCard.dto";
import { User } from "../models/users.model";


@Injectable()
export class CurrentLessonCardsService {

    constructor(
      @InjectModel(CurrentLessonCards) private currentLessonRepository: typeof CurrentLessonCards,
      @InjectModel(UserCards) private userCardsRepository: typeof UserCards,
      @InjectModel(User) private userRepository: typeof User,
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
        const today = (new Date());
        const checkDate = await this.currentLessonRepository.findOne({ where: { userId: dto.userId } });
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
        const cardsForLearn = await this.userCardsService.getCards(dto);

        const lessonParam = await this.userCardsRepository.findAll({
            where: {
                cardId: cardsForLearn.map(card => card.id)
            }
        });

        try {
            const cardsToCreate = cardsForLearn.map(card => ({ cardId: card.id }));
            const lessonParamToCreate = lessonParam.map(param => ({ cardId: param.cardId }));
            await this.currentLessonRepository.bulkCreate([...cardsToCreate, ...lessonParamToCreate]);
            await this.fillPosition(dto.userId);
            await this.fillData(dto.userId);

        } catch (e) {
            throw new HttpException(`Ошибка загрузки урока: ${e.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    async getFirstCard(userID: number) {
        return await this.currentLessonRepository.findOne({ where: { position: 1, userId: userID } });
    }


    async updateCard(dto: RateCardDto) {
        console.log(dto.cardId);


        const cardFromUser = await this.currentLessonRepository.findOne({ where: { cardId: dto.cardId, userId: dto.userID } });
        console.log(cardFromUser);
        cardFromUser.grade = dto.grade;
        cardFromUser.repetitionCount++;
        cardFromUser.totalRepetitionCount++;

        await cardFromUser.save();
        return this.decideNextStep(cardFromUser, dto.grade);
    }

    async decideNextStep(cardFromUser: CurrentLessonCards, grade: number) {

        let showAgain = false;
        if (grade < 5 && cardFromUser.repetitionNumber === 0 && cardFromUser.repetitionCount <= Number(process.env.MIN_REPEAT_PER_FIRST_DAY)) {
            showAgain = true;
        } else {
            if (grade < 5 && cardFromUser.repetitionNumber !== 0 && cardFromUser.repetitionCount <= Number(process.env.MIN_REPEAT_PER_DAY)) {
                showAgain = true;
            }
        }
        return await this.decideLastStep(showAgain, cardFromUser);

    }

    async decideLastStep(showAgain: boolean, cardFromUser: CurrentLessonCards) {
        if (showAgain) {
            return this.changeCardPositionOrRemove(cardFromUser);
        } else {
            if (cardFromUser.isNew) {
                cardFromUser.isNew = false;
                await cardFromUser.save();
            }
            cardFromUser.repetitionNumber++;
            cardFromUser.grade = cardFromUser.grade / cardFromUser.repetitionCount;
            await cardFromUser.save();
            const userId = cardFromUser.UserCardsId;
            const updatingCard = await this.userCardsRepository.findOne({ where: { id: userId } });
            const currentCard = await this.currentLessonRepository.findOne({ where: { id: cardFromUser.id } });
            await updatingCard.update({
                grade: currentCard.grade,
                totalRepetitionCount: currentCard.totalRepetitionCount,
                repetitionNumber: currentCard.repetitionNumber
            });
            await currentCard.destroy();
            return this.userCardsService.calculateCards(updatingCard.id);
        }
    }


    async changeCardPositionOrRemove(cardForRepeat: CurrentLessonCards) {
        const cardPosition = await this.currentLessonRepository.findAll({ order: [["position", "ASC"]] });

        for (const card of cardPosition) {
            if (card.position >= Number(process.env.POSITION_FOR_REPEAT)) {
                if (card.id !== cardForRepeat.id) {
                    await card.update({ position: card.position + 1 });
                }
            }
        }
        await cardForRepeat.update({ position: Number(process.env.POSITION_FOR_REPEAT) });
    }
}