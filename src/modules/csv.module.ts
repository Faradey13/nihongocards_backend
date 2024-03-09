import {  Module } from "@nestjs/common";
import { CsvController } from "../controllers/csv.controller";
import { CsvService } from "../services/csv.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Card } from "../models/cards.model";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users.module";
import { UserCardsModule } from "./user-cards.module";

@Module({
  controllers: [CsvController],
  providers: [CsvService],
  imports: [
    UserCardsModule,
    SequelizeModule.forFeature([Card]),
    MulterModule.register({
      dest: './uploads',
    })
  ],
})
export class CsvModule {}
