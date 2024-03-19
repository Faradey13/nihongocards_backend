import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import * as uuid from "uuid";
import { UsersService} from "../users/users.service";
import { CreateUserDto } from "../users/create-user.dto";
import { MailService } from "../mail/mail.service";
import { TokenDto } from "../token/tokenDto";
import { TokenService } from "../token/token.service";
import { PrismaService } from "../prisma/prisma.service";



@Injectable()
export class AuthService {


    constructor(
      private userService: UsersService,
      private tokenService: TokenService,
      private mailService: MailService,
      private prisma: PrismaService
    ) {
    }

    async newTokens(user: TokenDto) {

        const tokenDto = {
            id: user.id,
            email: user.email,
            isActivated: user.isActivated,
            roles: user.roles
        };
        const tokens = await this.tokenService.generateToken({ ...tokenDto });
        await this.tokenService.saveToken(user.id, tokens.refreshToken);
        return { ...tokens, user: tokenDto };
    }



    async registration(userDto: CreateUserDto) {
        const candidate = await this.userService.getUserByEmail(userDto.email);
        if (candidate) {
            throw new HttpException("пользователь с таким емейл уже существует", HttpStatus.BAD_REQUEST);
        }
        const hashPassword = await bcrypt.hash(userDto.password, 5);
        const activationLink = uuid.v4();

        const user = await this.userService.createUser({ ...userDto, password: hashPassword, activationLink });
        // await this.mailService.example(userDto.email, `http://localhost:5000/auth/activation/${activationLink}`);
        const findUser = await this.prisma.user.findUnique({where:{email:user.email}})

        return await this.newTokens(user)
    }

    async activate(activationLink: string) {
        try {
            const user = await this.prisma.user.findFirst({
                where: {
                    activationLink: activationLink
                }
            });

            if (!user) {
                throw new Error("Пользователь не найден");
            }

            await this.prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    isActivated: true
                }
            });
        } catch (error) {
            throw new Error("Ошибка активации пользователя");
        }
    }

    async login(userDto: CreateUserDto) {
        const user = await this.userService.getUserByEmail(userDto.email);
        if(!user) {
            throw new HttpException("Пользователь с такми email найден", HttpStatus.BAD_REQUEST)
        }
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if (!passwordEquals) {
            throw new UnauthorizedException({ message: "Некорректый емейл или пароль" });
        }
        const userWithRoles = await this.userService.getUserWithRoles(user.id)




        const userDTO: TokenDto = {
            id: userWithRoles.id,
            roles: userWithRoles.roles,
            isActivated: userWithRoles.isActivated,
            email: userWithRoles.email
        }
        console.log(`login dto${userDTO}`)
        const tokens = await this.tokenService.generateToken({ ...userDTO })
        console.log(tokens)
        await this.tokenService.saveToken(userDTO.id, tokens.refreshToken)

        return { ...tokens, user: userDTO };
    }

    async logout(refreshToken: string) {
        return await this.tokenService.removeToken(refreshToken)
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw new UnauthorizedException('пользователь не авторизован')
        }
        const userData = await this.tokenService.validateRefreshToken(refreshToken)
        const tokenFromDB = await this.tokenService.findToken(refreshToken)
        if (!userData || !tokenFromDB) {
            throw new UnauthorizedException('пользователь не авторизован')
        }
        const user = await this.userService.getUserWithRoles(tokenFromDB.userId)
        return await this.newTokens(user)
    }



}
