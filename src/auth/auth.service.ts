import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import * as uuid from "uuid";
import { UsersService } from "../users/users.service";
import { CreateUserDto } from "../users/create-user.dto";
import { MailService } from "../mail/mail.service";
import { TokenDto } from "../token/tokenDto";
import { TokenService } from "../token/token.service";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "../users/users.model";
import { Token } from "../token/token.model";


@Injectable()
export class AuthService {


    constructor(
      @InjectModel(User) private userRepository: typeof User,
      @InjectModel(Token) private tokenRepository: typeof Token,
      private userService: UsersService,
      private tokenService: TokenService,
      private mailService: MailService
    ) {
    }

    async newTokens(user:User) {
        const tokenDto = new TokenDto(user);
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
        console.log(typeof activationLink)
        const user = await this.userService.createUser({ ...userDto, password: hashPassword, activationLink });
        await this.mailService.example(userDto.email, `http://localhost:5000/auth/activation/${activationLink}`);
        return this.newTokens(user)
    }

     async activate(activationLink: string) {
        try {
            await this.userRepository.update({isActivated: true},{where: {
                    activationLink: activationLink
                }})
        } catch (e) {
            throw new HttpException(`Ошибка активации акаунта, свяжитесь с администрацией сайта, ${e.message}`, HttpStatus.BAD_REQUEST)
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

        const userDTO = new TokenDto(user)
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
        const user = await this.userRepository.findByPk(userData.id)
        return await this.newTokens(user)
    }



}
