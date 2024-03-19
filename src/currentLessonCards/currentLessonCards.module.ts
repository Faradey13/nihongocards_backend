import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../users/users.model";
import { Card } from "../cards/cards.model";
import { UserCards } from "../user-cards/user-cards.model";
import { CurrentLessonCards } from "./currentLessonCards.model";
import { UserCardsModule } from "../user-cards/user-cards.module";
import { CurrentLessonService } from "./currentLessonCards.service";
import { PrismaService } from "../prisma/prisma.service";


@Module({
    providers: [CurrentLessonService, PrismaService],
    controllers: [],
    imports: [
        // SequelizeModule.forFeature([User, Card, UserCards, CurrentLessonCards]),
        UserCardsModule
    ], exports: [
      CurrentLessonService
    ]

})
export class CurrentLessonCardsModule {

}
