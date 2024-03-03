import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import * as process from "process";
import { AuthService } from "../services/auth.service";
import { AuthController } from "../controllers/auth.controller";
import { UsersModule } from "./users.module";
import { MailModule } from "./mail.module";
import { TokenModule } from "./token.module";
import { TokenService } from "../services/token.service";


@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    forwardRef(()=>UsersModule),
    MailModule,
    TokenModule,


  ],
    exports: [
      AuthService,

    ]
})
export class AuthModule {}
