import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import * as process from "process";
import { AuthService } from "../services/auth.service";
import { AuthController } from "../controllers/auth.controller";
import { UsersModule } from "./users.module";
import { MailService } from "../services/mail.service";
import { MailModule } from "./mail.module";
import { TokenModule } from "./token.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../models/users.model";
import { Token } from "../models/token.model";


@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    TokenModule,
    MailModule,
    SequelizeModule.forFeature([User, Token]),
    forwardRef(()=>UsersModule),

  ],
    exports: [
      AuthService,

    ]
})
export class AuthModule {}
