import { Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../models/users.model";
import { UserCardsService } from "../services/user-cards.service";
import { UserCardsController } from "../controllers/user-cards.controller";
import { Card } from "../models/cards.model";
import { FilesModule } from "./files.module";
import { MulterModule } from "@nestjs/platform-express";


@Module({
  providers: [UserCardsService],
  controllers: [UserCardsController],
  imports: [
    SequelizeModule.forFeature([User, Card]),
    FilesModule,

  ],
})
export class UserCardsModule {

}
