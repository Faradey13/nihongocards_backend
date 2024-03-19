
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { RolesModule } from "./roles/roles.module";
import { AuthModule } from "./auth/auth.module";
import { CardsModule } from "./cards/cards.module";
import { FilesModule } from "./files/files.module";
import { CsvModule } from "./csv/csv.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import * as path from "path";

import { CurrentLessonCardsModule } from "./currentLessonCards/currentLessonCards.module";
import { GatewayModule } from "./socket/gateway.module";
import { TokenModule } from './token/token.module';

import { MailModule } from "./mail/mail.module";
import { ScheduleModule } from "@nestjs/schedule";
import { TaskService } from "./tasks/task.service";
import { LoggerMiddleware } from "./midlewares/Logger";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { GraphQLModule } from "@nestjs/graphql";
import { join } from "path";
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';





@Module({
  controllers: [],
  providers: [TaskService],
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground:false,
      context: ({ req, res }) => ({ req, res }),
      installSubscriptionHandlers: true,
      subscriptions: {
        'graphql-ws': true
      },
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,

    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    // SequelizeModule.forRoot({
    //   dialect: 'postgres',
    //   host: process.env.POSTGRES_HOST,
    //   port: Number(process.env.POSTGRESS_PORT),
    //   username: process.env.POSTGRES_USER,
    //   password: String(process.env.POSTGRESS_PASSWORD),
    //   database: process.env.POSTGRES_DB,
    //   models: [User, Role, UserRoles, Card, UserCards, CurrentLessonCards, Token],
    //   autoLoadModels: true,
    //
    // }),
    TokenModule,
    UsersModule,
    RolesModule,
    AuthModule,
    CardsModule,
    FilesModule,
    CsvModule,
    CurrentLessonCardsModule,
    GatewayModule,
    MailModule,

    
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*'); // Middleware будет применяться ко всем маршрутам
  }
}