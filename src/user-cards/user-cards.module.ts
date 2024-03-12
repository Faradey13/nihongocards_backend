import {  Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../users/users.model";
import { UserCardsService } from "./user-cards.service";
import { UserCardsController } from "./user-cards.controller";
import { Card } from "../cards/cards.model";
import { UserCards } from "./user-cards.model";
import { JwtModule } from "@nestjs/jwt";


@Module({
  providers: [UserCardsService],
  controllers: [UserCardsController],
  imports: [
    SequelizeModule.forFeature([User, Card, UserCards]),
    JwtModule
  ],
  exports: [
    UserCardsService
  ]

})
export class UserCardsModule {

}
