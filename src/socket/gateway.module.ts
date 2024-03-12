import { Module } from "@nestjs/common";
import { AppGateway } from "./gateway";
import { CurrentLessonCardsModule } from "../currentLessonCards/currentLessonCards.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../users/users.model";
import { UserCards } from "../user-cards/user-cards.model";
import { UsersModule } from "../users/users.module";
import { UserCardsModule } from "../user-cards/user-cards.module";


@Module({

    providers: [AppGateway ],
    controllers: [],
    imports: [
        SequelizeModule.forFeature([User, UserCards]),
        CurrentLessonCardsModule,
        UsersModule,
        UserCardsModule
    ],

})
export class GatewayModule {

}
