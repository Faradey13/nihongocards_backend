import { Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { RolesService } from "./roles.service";
import { Role } from "./roles.model";
import { User } from "../users/users.model";
import { UserRoles } from "./user-roles.model";
import { JwtModule } from "@nestjs/jwt";
import { RoleResolver } from "./role.resolver";


@Module({
  controllers: [],
  providers: [RolesService, RoleResolver],
  imports: [
    SequelizeModule.forFeature([Role, User, UserRoles]),
    JwtModule
  ],
  exports: [RolesService]
})
export class RolesModule {

}
