import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { CardsService } from "./cards.service";
import { CardsController } from "./cards.controller";
import { User } from "../users/users.model";
import { Card } from "./cards.model";
import { FilesModule } from "../files/files.module";
import { JwtModule } from "@nestjs/jwt";
import { CardsResolver } from "./cards.resolver";


@Module({
  providers: [CardsService, CardsResolver],
  controllers: [CardsController],
  imports: [
    SequelizeModule.forFeature([User, Card]),
    FilesModule, JwtModule

  ],

})
export class CardsModule {}
