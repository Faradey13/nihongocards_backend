import {  Module } from "@nestjs/common";
import { CsvController } from "./csv.controller";
import { CsvService } from "./csv.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Card } from "../cards/cards.model";
import { MulterModule } from "@nestjs/platform-express";
import { UserCardsModule } from "../user-cards/user-cards.module";
import { JwtModule } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  controllers: [CsvController],
  providers: [CsvService, PrismaService],
  imports: [
    UserCardsModule,
    JwtModule,
    // SequelizeModule.forFeature([Card]),
    MulterModule.register({
      dest: './uploads',
    })
  ],
})
export class CsvModule {}
