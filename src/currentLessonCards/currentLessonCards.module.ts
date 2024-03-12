import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../users/users.model";
import { Card } from "../cards/cards.model";
import { UserCards } from "../user-cards/user-cards.model";
import { CurrentLessonCards } from "./currentLessonCards.model";
import { CurrentLessonCardsService } from "./currentLessonCards.service";
import { UserCardsModule } from "../user-cards/user-cards.module";


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
