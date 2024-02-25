import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../models/users.model";
import { Card } from "../models/cards.model";
import { UserCards } from "../models/user-cards.model";
import { CurrentLessonCards } from "../models/currentLessonCards.model";
import { CurrentLessonCardsService } from "../services/currentLessonCards.service";
import { UserCardsModule } from "./user-cards.module";


@Module({
    providers: [CurrentLessonCardsService],
    controllers: [],
    imports: [
        SequelizeModule.forFeature([User, Card, UserCards, CurrentLessonCards]),
        UserCardsModule
    ], exports: [
      CurrentLessonCardsService
    ]

})
export class CurrentLessonCardsModule {

}
