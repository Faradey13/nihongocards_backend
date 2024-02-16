import { Module } from "@nestjs/common";

import { SequelizeModule } from "@nestjs/sequelize";
import { UsersModule } from './users/users.module';
import { ConfigModule } from "@nestjs/config";
import * as process from "process";
import { User } from "./users/users.model";
import { RolesService } from './role/roles.service';
import { RolesController } from './role/roles.controller';
import { RolesModule } from './role/roles.module';
import { Role } from "./role/roles.model";
import { UserRoles } from "./role/user-roles.model";
import { UsersController } from "./users/users.controller";
import { UsersService } from "./users/users.service";
import { AuthModule } from './auth/auth.module';
import { CardsModule } from './cards/cards.module';
import { Card } from "./cards/cards.model";
import { UserCards } from "./cards/user-cards.model";
import { FilesModule } from './files/files.module';



@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRESS_PORT),
      username: process.env.POSTGRES_USER,
      password: String(process.env.POSTGRESS_PASSWORD),
      database: process.env.POSTGRES_DB,
      models: [User, Role, UserRoles, Card, UserCards],
      autoLoadModels: true
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    CardsModule,
    FilesModule,
  ],
})
export class AppModule {}