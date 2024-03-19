import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserCards } from "../user-cards/user-cards.model";
import { UserCardsService } from "../user-cards/user-cards.service";
import { CurrentLessonCards } from "./currentLessonCards.model";
import * as process from "process";
import { RateCardDto } from "./rateCard.dto";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma, currenLesson, userCards, cards } from "@prisma/client";
import { connect } from "rxjs";


@Injectable()
export class CurrentLessonService {

    constructor(
      private prisma: PrismaService,
      private userCardsService: UserCardsService
    ) {
    }

    async fillPosition(userId: number) {
        const userCards = await this.prisma.currenLesson.findMany({ where: { userId: userId } });
        await Promise.all(userCards.map(async (card, index) => {
            const pos  = index + 1;
            await this.prisma.currenLesson.update({where:{
                id: card.id
            }, data:{
                position: pos
                }})
        }));

    }


    async startNewLesson(userId: number) {
        await this.prisma.currenLesson.deleteMany();
        const today = (new Date());
        if (await this.prisma.currenLesson.count() > 0) {
            const oldCards = await this.prisma.currenLesson.findMany({ where: { userId: userId } });
            for(const card of oldCards){
                const lastLessonCard = card.currentLessonData;
                if (today.getTime() - lastLessonCard.getTime() > 24) {
                    await this.prisma.currenLesson.delete({
                        where: {
                            id: card.id
                        }
                    }).then(numRows => {
                        console.log(`Удалено ${numRows}записей`);
                    }).catch(error => {
                        console.error("Ошибка удаления записей:", error);
                    });
                }
            }
        }

        const cardsForLearn = await this.userCardsService.getCards(userId);
        if(typeof cardsForLearn === "string"){
            return cardsForLearn
        }
        const CardsId = cardsForLearn.map(card => card.id);
        const userCardsForLearn = await this.prisma.userCards.findMany({
            where: {
                cardId: {
                    in: CardsId
                },
                userId: userId
            }
        });


        try {
            const unitedCards = [];
            userCardsForLearn.forEach(cardU => {
                const correspondingCard = cardsForLearn.find(card => card.id === cardU.cardId);
                if (correspondingCard) {
                    unitedCards.push({
                        userCardsId: cardU.id,
                        cardId: correspondingCard.id,
                        userId: cardU.userId,
                        repetitionCount: 0,
                        grade: 0,
                        position: -1,
                        currentLessonData: new Date(),

                    });
                }
            });


            try {

               await this.prisma.currenLesson.createMany({data: unitedCards });

            }
           catch (e){`карты не загрузились${e.message}`}



        } catch (e) {
            throw new HttpException(`Ошибка загрузки урока: ${e.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        try {

            await this.fillPosition(userId);

        }
        catch (error) {
            console.error("Ошибка при изменении позиции:", error);
            throw error;
        }
    }


    async getFirstCard(userId: number) {
        console.log(userId)
        const newCard= await this.prisma.currenLesson.findFirst({ where: { position: 1, userId: userId } });
        console.log(newCard)
        if (!newCard) {

            console.log('карта не найдена'); // или throw new Error("Карточка не найдена");
            return undefined
        }

        const newCardData = await this.prisma.cards.findUnique({where: {id: newCard.cardId}})

        if (!newCardData) {
            console.log('статистика не найдена')

        }


        const card = []
        card.push({
            cardId: newCardData.id,
            word: newCardData.word,
            translation: newCardData.translation,
            example: newCardData.example,
            image: newCardData.image,
            audio: newCardData.audio
        })
        return card

    }


    async updateCard(dto: RateCardDto, userId: number) {


        const cardFromUser = await this.prisma.currenLesson.findFirst({ where: { cardId: dto.cardId, userId: userId } });
        const cardFromUserStats = await this.prisma.userCards.findFirst({where:{id: cardFromUser.userCardsId}})


        cardFromUser.grade = cardFromUser.grade + dto.grade;
        cardFromUser.repetitionCount++;
        cardFromUserStats.totalRepetitionCount++;


        const saveStats = async () => {
            await this.prisma.currenLesson.update({where:{
                    id: cardFromUser.id
                }, data: {
                    ...cardFromUser
                }})

            await this.prisma.userCards.update({where:{
                    id: cardFromUserStats.id
                }, data: {
                    ...cardFromUserStats
                }})
        }


        let showAgain = false;
        if (cardFromUserStats.repetitionNumber === 0) {
            if (dto.grade < 3) {
                cardFromUser.repetitionCount = 0;

            }
            if (dto.grade < 5 || cardFromUser.repetitionCount < 3) {
                showAgain = true;

            }
        }
        if (cardFromUserStats.repetitionNumber > 0) {
            if (dto.grade < 3) {
                cardFromUserStats.isHard = true;
                cardFromUser.repetitionCount = 0;
                ;
            }
            if (dto.grade < 5 && cardFromUser.repetitionCount < 2) {
                showAgain = true;

            }
        }

        await saveStats();
        return await this.decideLastStep(showAgain, cardFromUser, cardFromUserStats);

    }

    async decideLastStep(showAgain: boolean, cardFromUser: currenLesson, cardFromUserStats: userCards) {
        if (showAgain) {
            return this.changeCardPosition(cardFromUser);
        } else {
            if (cardFromUserStats.isNew) {
                cardFromUserStats.isNew = false
            }
            cardFromUserStats.repetitionNumber++;
            cardFromUserStats.grade = Math.floor(cardFromUser.grade / cardFromUser.repetitionCount);
            const userCardId = cardFromUser.userCardsId;
            await this.prisma.userCards.update({where:{
                    id: cardFromUserStats.id
                }, data: {
                    ...cardFromUserStats
                }});


            await this.destroyCard(cardFromUser)
            return this.userCardsService.calculateCards(userCardId);
        }
    }


    async changeCardPosition(cardForRepeat: currenLesson) {
        const cardsToMove = await this.prisma.currenLesson.findMany({
            where: {
                AND: [
                    { position: { lte: Number(process.env.POSITION_FOR_REPEAT) } },
                    { id: { not: cardForRepeat.id } }
                ]
            },
            orderBy: {
                position: 'asc'
            }
        });

        console.log(`cardForRepeat ${cardForRepeat.position}`)
        await this.prisma.currenLesson.update({where: {
                id: cardForRepeat.id
            },
            data: {
                position: -1
            }
        });
        await this.prisma.currenLesson.updateMany({
            where: {
                position: { gt: 0, lte: Number(process.env.POSITION_FOR_REPEAT) },
                id: { not: cardForRepeat.id }
            },
            data: {
                position: { decrement: 1 }
            }
        });

        await this.prisma.currenLesson.update({where: {
                id: cardForRepeat.id
            },
            data: {
                position: Number(process.env.POSITION_FOR_REPEAT)
            }
        });
    }

    async destroyCard(cardForRemove: currenLesson) {

        await this.prisma.currenLesson.delete({where:{id: cardForRemove.id}})
        await this.prisma.currenLesson.updateMany({
            data: {
                position: { decrement: 1 }
            }
        });
    }
}