import {  Module } from "@nestjs/common";
import { CsvController } from "../controllers/csv.controller";
import { CsvService } from "../services/csv.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Card } from "../models/cards.model";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  controllers: [CsvController],
  providers: [CsvService],
  imports: [
    SequelizeModule.forFeature([Card]),
    MulterModule.register({
      dest: './uploads',
    })
  ],
})
export class CsvModule {}
