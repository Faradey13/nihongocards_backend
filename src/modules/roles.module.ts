import { Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { RolesController } from "../controllers/roles.controller";
import { RolesService } from "../services/roles.service";
import { Role } from "../models/roles.model";
import { User } from "../models/users.model";
import { UserRoles } from "../models/user-roles.model";
import { JwtModule } from "@nestjs/jwt";


@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [
    JwtModule.register({}),
    SequelizeModule.forFeature([Role, User, UserRoles])
  ],
  exports: [RolesService]
})
export class RolesModule {

}
