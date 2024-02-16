import { forwardRef, Module } from "@nestjs/common";
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../users/users.model";
import { Role } from "../role/roles.model";
import { UserRoles } from "../role/user-roles.model";
import { Card } from "./cards.model";
import { AuthModule } from "../auth/auth.module";
import { RolesModule } from "../role/roles.module";

@Module({
  providers: [CardsService],
  controllers: [CardsController],
  imports: [
    SequelizeModule.forFeature([User, Card]),
  ],
})
export class CardsModule {}
