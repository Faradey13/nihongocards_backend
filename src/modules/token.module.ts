import { Module } from "@nestjs/common";
import { MailService } from "../services/mail.service";
import { TokenService } from "../services/token.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import process from "process";
import { SequelizeModule } from "@nestjs/sequelize";
import { Token } from "../models/token.model";


@Module({
    providers: [TokenService, JwtService ],
    imports: [
      JwtModule.register({}),
        SequelizeModule.forFeature([Token])],
    exports: [TokenModule, JwtService]
})

export class TokenModule{}