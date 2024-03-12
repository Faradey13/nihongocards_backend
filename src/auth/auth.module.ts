import { forwardRef, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "../users/users.module";
import { MailModule } from "../mail/mail.module";
import { TokenModule } from "../token/token.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../users/users.model";
import { Token } from "../token/token.model";
import { AuthResolver } from "./auth.resolver";


@Module({
  providers: [AuthService, AuthResolver],
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
