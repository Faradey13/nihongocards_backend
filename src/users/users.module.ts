import { forwardRef, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserRoles } from "../roles/user-roles.model";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { User } from "./users.model";
import { Role } from "../roles/roles.model";
import { Card } from "../cards/cards.model";
import { AuthModule } from "../auth/auth.module";
import { RolesModule } from "../roles/roles.module";
import { UserCards } from "../user-cards/user-cards.model";
import { JwtModule } from "@nestjs/jwt";
import { UsersResolver } from "./users.resolver";




@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersResolver],
  imports: [
    JwtModule.register({}),
    SequelizeModule.forFeature([User, Card, Role, UserCards, UserRoles]),
    forwardRef(()=> AuthModule),
    RolesModule,


  ],
  exports: [
    UsersService,
    JwtModule

  ]
})
export class UsersModule {}
