
import { TokenDto } from "../dto/token.dto";
import { Token } from "../models/token.model";
import { Op } from "sequelize";
import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";
@Injectable()
export class TokenService {
    constructor(
                private userTokenRepository: typeof Token,
                private jwtService : JwtService) {
    }

    async generateToken(payload: TokenDto) {
        console.log(typeof payload)
        try {
            console.log(this.jwtService.sign(payload, { secret: process.env.PRIVATE_KEY }))
            const accessToken = this.jwtService.sign(payload, { secret: process.env.PRIVATE_KEY });
            console.log('ff')
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

    async removeOldToken() {
        await this.userTokenRepository.findAll({
            where: {
                dateForRemoving: { [Op.gte] : new Date()}
            }
        });
    }
}