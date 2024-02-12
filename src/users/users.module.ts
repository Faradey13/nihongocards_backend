import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from "./users.model";
import { Role } from "../role/role.models";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserRoles } from "./user-roles.model";


@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, Role, UserRoles])
  ]
})
export class UsersModule {}
