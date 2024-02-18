import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import * as process from "process";
import { AuthService } from "../services/auth.service";
import { AuthController } from "../controllers/auth.controller";
import { UsersModule } from "./users.module";


@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    forwardRef(()=>UsersModule),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24h'
      }
    })
  ],
    exports: [
      AuthService,
      JwtModule
    ]
})
export class AuthModule {}
