import { Module } from "@nestjs/common";
import { AppGateway } from "../websocket/gateway";
import { CurrentLessonCardsModule } from "./currentLessonCards.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../models/users.model";
import { UserCards } from "../models/user-cards.model";
import { UsersModule } from "./users.module";
import { UserCardsModule } from "./user-cards.module";


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
