import { Module } from '@nestjs/common';
import { RolesController } from "./roles.controller";
import { RolesService } from "./roles.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../users/users.model";
import { Role } from "./role.models";

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [
    SequelizeModule.forFeature([Role, User])
  ]
})
export class RoleModules {

}
