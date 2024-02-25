import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { CardsService } from "../services/cards.service";
import { CardsController } from "../controllers/cards.controller";
import { User } from "../models/users.model";
import { Card } from "../models/cards.model";
import { FilesModule } from "./files.module";


@Module({
  providers: [CardsService],
  controllers: [CardsController],
  imports: [
    SequelizeModule.forFeature([User, Card]),
    FilesModule,

  ],

})
export class CardsModule {}
