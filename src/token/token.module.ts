import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule } from "@nestjs/jwt";
import { Token } from "./token.model";
import { SequelizeModule } from "@nestjs/sequelize";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  providers: [TokenService, PrismaService],
  imports: [JwtModule.register({}),
    // SequelizeModule.forFeature([Token])
  ],
  exports: [
    TokenService
  ]
})
export class TokenModule {}
