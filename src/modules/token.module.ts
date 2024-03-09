import { Module } from '@nestjs/common';
import { TokenService } from '../services/token.service';
import { JwtModule } from "@nestjs/jwt";
import process from "process";
import { Token } from "../models/token.model";
import { SequelizeModule } from "@nestjs/sequelize";

@Module({
  providers: [TokenService],
  imports: [JwtModule.register({}),
    SequelizeModule.forFeature([Token])
  ],
  exports: [
    TokenService
  ]
})
export class TokenModule {}
