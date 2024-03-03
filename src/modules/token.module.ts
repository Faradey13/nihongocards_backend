import { Module } from "@nestjs/common";
import { TokenService } from "../services/token.service";
import { JwtModule } from "@nestjs/jwt";
import { SequelizeModule } from "@nestjs/sequelize";
import { Token } from "../models/token.model";



@Module({
    providers: [TokenService],
    imports: [
      JwtModule.register({}),
        SequelizeModule.forFeature([Token])
    ],
    exports: [TokenService ]
})

export class TokenModule{

}

