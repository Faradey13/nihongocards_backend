import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { userCards, user } from "@prisma/client";
import { distinct } from "rxjs";
import { add, startOfDay } from "date-fns";

@Injectable()
export class UserCardsService {
    constructor(
      private prisma: PrismaService
    ) {
    }

    async addCardsToUsers() {
        try {
            const cards = await this.prisma.cards.findMany();
            const users = await this.prisma.user.findMany();

            const userCardData = [];
            users.forEach(user => {
                cards.forEach(card => {
                    userCardData.push({
                        userId: user.id,
                        cardId: card.id,
                        category: card.category
                    });
                });
            });

            await Promise.all(userCardData.map(data => {
                this.prisma.userCards.create({
                    data: {
                        ...data
                    }
                });
            }));

            return { success: true, message: "Карты успешно добавлены пользователям" };

        } catch (e) {
            throw new HttpException(`Ошибка: ${e.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async calculateCards(id: number) {
        const currentCard: userCards = await this.prisma.userCards.findUnique({
            where: {
                id: id
            }
        });
        const grade = currentCard.grade;
        console.log(`старт расчета интервала ${currentCard}`);

        if (!currentCard) {
            throw new Error(`Карточка с id ${id} не найдена`);
        }
        if (currentCard.isHard) {
            currentCard.interval = 1;
        }
        if (grade < 0 || grade > 5) {
            console.error("Оценка должна быть в диапазоне от 0 до 5");
            return;
        }
        if (grade >= 3) {
            if (currentCard.repetitionNumber === 1) {
                currentCard.interval = 1;
            } else if (currentCard.repetitionNumber === 2) {
                currentCard.interval = 3;
            } else {
                currentCard.factorOfEasiness = Math.max(Number(process.env.MAX_FOE), currentCard.factorOfEasiness +
                  (Number(process.env.GRADE_MULTIPLIER) - (5 - grade) * (Number(process.env.GRADE_MULTIPLIER) + (5 -
                    grade) * Number(process.env.GRADE_FACTOR_MULTIPLIER))));
                currentCard.interval = Math.round(currentCard.interval * currentCard.factorOfEasiness);
            }
            currentCard.repetitionNumber++;
        } else {

            currentCard.interval = 1;

        }
        const today = new Date();
        currentCard.lastRepetition = today;
        currentCard.nextRepetition = add(new Date(), { days: currentCard.interval });
        await this.prisma.userCards.update({
            where: {
                id: currentCard.id
            },
            data: {
                ...currentCard
            }

        });
        return currentCard;
    };

    async changeLimits(newLimit: number, oldLimit: number, userId: number) {
        const limits = await this.prisma.userLimit.findFirst({ where: { userId: userId } });
        const userBefore = await this.prisma.user.findUnique({ where: { id: userId } });
        const today = startOfDay(new Date());
        const diffLimitNew = newLimit - userBefore.newLimit;
        const diffLimitOld = oldLimit - userBefore.oldLimit;
        if (limits.today && limits.today === today && diffLimitNew > 0) {
            await this.prisma.userLimit.update({
                where: {
                    id: limits.id
                },
                data: {
                    todayLimitNew: diffLimitNew

                }
            });
        } else if (limits.today === today && diffLimitOld > 0) {
            await this.prisma.userLimit.update({
                where: {
                    id: limits.id
                },
                data: {
                    todayLimitOld: diffLimitOld

                }
            });
        }
        await this.prisma.user.update({
            where: {
                id: userId
            }, data: {
                newLimit: newLimit,
                oldLimit: oldLimit
            }
        });
    }


    async getCards(userId: number) {
        const today = startOfDay(new Date());
        // const tomorrow = add(today, {days: 1})
        const user: user = await this.prisma.user.findUnique({ where: { id: userId } });
        const limitsCheck = await this.prisma.userLimit.findFirst({ where: { userId: userId } });
        console.log(limitsCheck);
        if (limitsCheck === null || limitsCheck.today > today) {
            await this.prisma.userLimit.create({
                data:
                  { userId: userId, todayLimitNew: user.newLimit, todayLimitOld: user.oldLimit, today: today }

            });
        }

        const limits = await this.prisma.userLimit.findFirst({ where: { userId: userId } });
        console.log(limits);
        const newLimit = limits.todayLimitNew;
        const oldLimit = limits.todayLimitOld;
        if (newLimit === 0) {
            return "новые карты на сегодня закончились, вы можете увеличить дневной лимит";
        }
        if (oldLimit === 0) {
            return "карты для повторения на сегодня закончились, вы можете увеличить дневной лимит";
        }
        const newCards: userCards[] = await this.prisma.userCards.findMany({
            where: {
                userId: userId,
                isNew: true
                // category: dto.category || undefined

            },

            take: newLimit
        });

        const repetitionCards: userCards[] = await this.prisma.userCards.findMany(({
            where: {
                userId: userId,
                isNew: false,
                nextRepetition: {
                    lte: new Date()
                }
            },
            take: oldLimit
        }));
        // console.log(repetitionCards)
        // console.log(newCards)
        await this.prisma.userLimit.update({
            where: { id: limits.id }, data: {
                todayLimitNew: 0, todayLimitOld: 0
            }
        });

        const cardIds = new Set([
            ...newCards.map((userCard) => userCard.cardId),
            ...repetitionCards.map((userCard) => userCard.cardId)
        ]);

        return this.prisma.cards.findMany({
            where: {
                id: {
                    in: Array.from(cardIds)
                }
            }
        });
    };

    async refreshProgress(userId: number) {
        await this.prisma.userCards.updateMany({
            where: { userId: userId }, data: {
                factorOfEasiness: 2.5,
                interval: 0,
                repetitionNumber: 0,
                repetitionCount: 0,
                totalRepetitionCount: 0,
                grade: 0,
                lastRepetition: null,
                isNew: true
            }
        });
    }
}

