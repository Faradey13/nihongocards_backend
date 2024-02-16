import { forwardRef, Module } from "@nestjs/common";
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from "./users.model";
import { Role } from "../role/roles.model";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserRoles } from "../role/user-roles.model";
import { RolesModule } from "../role/roles.module";
import { AuthModule } from "../auth/auth.module";
import { Card } from "../cards/cards.model";


@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, Role, UserRoles, Card]),
    forwardRef(()=> AuthModule),
    RolesModule
  ],
  exports: [
    UsersService,

  ]
})
export class UsersModule {}
