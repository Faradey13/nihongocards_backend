import { Module } from "@nestjs/common";
import { AppGateway } from "../websocket/gateway";
import { CurrentLessonCardsModule } from "./currentLessonCards.module";


@Module({

    providers: [AppGateway ],
    controllers: [],
    imports: [
        CurrentLessonCardsModule
    ],

})
export class GatewayModule {

}
