import { Body, HttpException, HttpStatus, Injectable, Post, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { UsersService } from "./users.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { User } from "../models/users.model";
import * as uuid from "uuid";
import { MailService } from "./mail.service";
import { TokenService } from "./token.service";
import { TokenDto } from "../dto/token.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {


    constructor(private userService: UsersService,
                private mailService: MailService,
                private tokenService: TokenService,
    private jwtService : JwtService,) {
    }

    async login(userDto: CreateUserDto) {
        const user = await this.validateUser(userDto);
        // return this.generateToken(user);
    }


    async registration(userDto: CreateUserDto) {
        const candidate = await this.userService.getUserByEmail(userDto.email);
        if (candidate) {
            throw new HttpException(`Пользователь с почтой ${userDto.email} уже зарегестрирован`, HttpStatus.BAD_REQUEST);
        }
        const hashPassword = await bcrypt.hash(userDto.password, 5);
        const activationLink = uuid.v4();
        const user = await this.userService.createUser({ ...userDto, password: hashPassword, activationLink });
        await this.mailService.sendActivationMail(userDto.email, activationLink);
        const tokenDto = new TokenDto(user)
        console.log({ ...tokenDto })
        const tokens = await this.tokenService.generateToken({...tokenDto})
        await this.tokenService.saveToken(user.id, tokens.refreshToken)
        return {...tokens, user: tokenDto}
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

    private async validateUser(userDto: CreateUserDto) {
        const user = await this.userService.getUserByEmail(userDto.email);
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if (user && passwordEquals) {
            return user;
        }
        throw new UnauthorizedException({ message: "Некорректый емейл или пароль" });
    }
}