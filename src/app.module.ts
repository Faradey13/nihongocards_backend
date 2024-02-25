
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./models/users.model";
import { Role } from "./models/roles.model";
import { UserRoles } from "./models/user-roles.model";
import { Card } from "./models/cards.model";
import { UserCards } from "./models/user-cards.model";
import { UsersModule } from "./modules/users.module";
import { RolesModule } from "./modules/roles.module";
import { AuthModule } from "./modules/auth.module";
import { CardsModule } from "./modules/cards.module";
import { FilesModule } from "./modules/files.module";
import { CsvModule } from "./modules/csv.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import * as path from "path";
import { CurrentLessonCards } from "./models/currentLessonCards.model";
import { CurrentLessonCardsModule } from "./modules/currentLessonCards.module";
import { GatewayModule } from "./modules/gateway.module";



@Module({
  controllers: [],
  providers: [],
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname,  'static'),
    }),
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
      models: [User, Role, UserRoles, Card, UserCards, CurrentLessonCards],
      autoLoadModels: true,

    }),
    UsersModule,
    RolesModule,
    AuthModule,
    CardsModule,
    FilesModule,
    CsvModule,
    CurrentLessonCardsModule,
    GatewayModule
    
  ],
})
export class AppModule {}