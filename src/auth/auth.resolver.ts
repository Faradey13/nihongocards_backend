import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { FastifyReply } from 'fastify/types/reply';
import { User } from "../users/users.model";
import { CreateUserDto } from "../users/create-user.dto";




@Resolver('auth')
export class AuthResolver {
    constructor(
      private authService: AuthService
    ) {}
    @Mutation(() => User)
    async login(@Args('input') input: CreateUserDto, reply: FastifyReply){
        try {
            const UserData = await this.authService.login(input);
            reply.setCookie("refreshToken", UserData.refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
            return UserData;
        }
        catch (e){
            reply.code(500).send(`ошибка авторизации ${e.message}`);
            throw e;
        }
    }

    @Mutation(() => User)
    async registration(@Args('input') input: CreateUserDto, reply: FastifyReply) {
        try {
            const UserData = await this.authService.registration(input);
            reply.setCookie("refreshToken", UserData.refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
            return UserData;
        } catch (e) {
            reply.code(500).send(`ошибка авторизации ${e.message}`);
            throw e;
        }
    }


}