import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule } from "@nestjs/jwt";
import { Token } from "./token.model";
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
