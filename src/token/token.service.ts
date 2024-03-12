import { Injectable } from '@nestjs/common';
import { Token } from "./token.model";
import { JwtService } from "@nestjs/jwt";
import { TokenDto } from "./tokenDto";
import { Op } from "sequelize";
import { InjectModel } from "@nestjs/sequelize";


@Injectable()
export class TokenService {
    constructor(
      private jwtService: JwtService,
      @InjectModel(Token) private userTokenRepository: typeof Token,
      ) {
    }

    async generateToken(payload: TokenDto) {
        console.log(payload)
        try {
            const accessToken = this.jwtService.sign(payload, { secret: process.env.PRIVATE_KEY });
            console.log(accessToken)
            const refreshToken = this.jwtService.sign(payload, {
                secret: process.env.PRIVATE_KEY_REFRESH,
                expiresIn: "30d"
            });
            console.log(refreshToken)

            return {
                accessToken,
                refreshToken
            };
        } catch (e) {
            console.log(e)
        }

    }

    async saveToken(userId: number, refreshToken: string) {
        const tokenData = await this.userTokenRepository.findOne({
            where: {
                userId: userId
            }
        })
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save

        } else {
            const newToken =
              await this.userTokenRepository.create({
                  userId: userId,
                  refreshToken: refreshToken,
                  dateForRemoving: new Date(new Date().setDate(new Date().getDate() + 30)) });
            return newToken
        }

    }

    async validateAccessToken(token){
        try {
            return  this.jwtService.verify(token, {secret: process.env.PRIVATE_KEY})

        } catch (e) {
            return null
        }
    }

    async validateRefreshToken(token){
        try {
            return this.jwtService.verify(token, {secret: process.env.PRIVATE_KEY_REFRESH})
        } catch (e) {
            return null
        }
    }

    async removeOldToken() {
       return await this.userTokenRepository.destroy({
            where: {
                dateForRemoving: { [Op.lte] : new Date()}
            }
        });
    }

    async removeToken(refreshToken) {
        const token =  await this.userTokenRepository.destroy({where:{refreshToken: refreshToken}})
        console.log(`удалена ${ token } запись токена`)
        return token

    }

    async findToken(refreshToken: string) {
        const tokenData =  await this.userTokenRepository.findOne({where:{refreshToken: refreshToken}})
        console.log(`найден токен ${ tokenData } `)
        return tokenData

    }
}
