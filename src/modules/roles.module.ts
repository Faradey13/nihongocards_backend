import { Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { RolesController } from "../controllers/roles.controller";
import { RolesService } from "../services/roles.service";
import { Role } from "../models/roles.model";
import { User } from "../models/users.model";
import { UserRoles } from "../models/user-roles.model";


@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [
    SequelizeModule.forFeature([Role, User, UserRoles])
  ],
  exports: [RolesService]
})
export class RolesModule {

}
