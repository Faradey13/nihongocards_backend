import { forwardRef, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserRoles } from "../models/user-roles.model";
import { UsersController } from "../controllers/users.controller";
import { UsersService } from "../services/users.service";
import { User } from "../models/users.model";
import { Role } from "../models/roles.model";
import { Card } from "../models/cards.model";
import { AuthModule } from "./auth.module";
import { RolesModule } from "./roles.module";
import { UserCards } from "../models/user-cards.model";




@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, Card, Role, UserCards, UserRoles]),
    forwardRef(()=> AuthModule),
    RolesModule,


  ],
  exports: [
    UsersService,

  ]
})
export class UsersModule {}
