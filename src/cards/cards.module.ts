import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { CardsService } from "./cards.service";

import { User } from "../users/users.model";
import { Card } from "./cards.model";
import { FilesModule } from "../files/files.module";
import { JwtModule } from "@nestjs/jwt";
import { CardsResolver } from "./cards.resolver";
import { PrismaService } from "../prisma/prisma.service";


@Module({
  providers: [CardsService, CardsResolver, PrismaService],
  controllers: [],
  imports: [
    // SequelizeModule.forFeature([User, Card]),
    FilesModule, JwtModule

  ],

})
export class CardsModule {}
