import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TokenDto } from "./tokenDto";
import { PrismaService } from "../prisma/prisma.service";


@Injectable()
export class TokenService {
    constructor(
      private jwtService: JwtService,
      private prisma: PrismaService
    ) {
    }

    async generateToken(payload: TokenDto) {
        console.log(payload);
        try {
            const accessToken = this.jwtService.sign(payload, { secret: process.env.PRIVATE_KEY });
            console.log(accessToken);
            const refreshToken = this.jwtService.sign(payload, {
                secret: process.env.PRIVATE_KEY_REFRESH,
                expiresIn: "30d"
            });
            console.log(refreshToken);

            return {
                accessToken,
                refreshToken
            };
        } catch (e) {
            console.log(e);
        }

    }

    async saveToken(userId: number, refreshToken: string) {
        const tokenData = await this.prisma.token.findFirst({
            where: {
                userId: userId
            }
        });
        if (tokenData) {
            await this.prisma.token.create({
                data: {
                    userId: userId,
                    refreshToken: refreshToken,
                    dateForRemoving: new Date(new Date().setDate(new Date().getDate() + 30))
                }
            });

        } else {

            return  this.prisma.token.create({
                  data:
                    {
                        userId: userId,
                        refreshToken: refreshToken,
                        dateForRemoving: new Date(new Date().setDate(new Date().getDate() + 30))
                    }
              });

        }

    }

    async validateAccessToken(token: string) {
        try {
            return this.jwtService.verify(token, { secret: process.env.PRIVATE_KEY });

        } catch (e) {
            return null;
        }
    }

    async validateRefreshToken(token: string) {
        try {
            return this.jwtService.verify(token, { secret: process.env.PRIVATE_KEY_REFRESH });
        } catch (e) {
            return null;
        }
    }

    async removeOldToken() {
        return  this.prisma.token.deleteMany({
            where: {
                dateForRemoving: {lte: new Date() }
            }
        });
    }

    async removeToken(refreshToken: string) {
        const token = await this.prisma.token.delete({ where: { refreshToken: refreshToken } });
        console.log(`удалена ${token} запись токена`);
        return token;

    }

    async findToken(refreshToken: string) {
        const tokenData = await this.prisma.token.findUnique({ where: { refreshToken: refreshToken } });
        console.log(`найден токен ${tokenData} `);
        return tokenData;

    }
}
