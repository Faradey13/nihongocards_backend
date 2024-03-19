import { Args, Context, GqlExecutionContext, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { Response } from 'express';

import { CreateUserDto } from "../users/create-user.dto";
import { User } from "../users/users.model";
import { InjectModel } from "@nestjs/sequelize";
import { PrismaClient, user } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";




@Resolver('auth')
export class AuthResolver {
    constructor(
      private authService: AuthService,
      private prisma: PrismaService
    ) {}
    @Mutation(() => User)
    async login(@Args('input') input: CreateUserDto, @Context() context:{ res: Response }):Promise<user>{

        try {
            const UserData = await this.authService.login(input);
            context.res.cookie("refreshToken", UserData.refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
            return await this.prisma.user.findUnique({where:{
                    id: UserData.user.id
                }})
        }
        catch (e){
            console.log(e.message)
        }
    }

    @Mutation(() => User)
    async registration(@Args('input') input: CreateUserDto, @Context() context: any):Promise<user> {
            const UserData = await this.authService.registration(input);
            context.res.cookie("refreshToken", UserData.refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
            return  this.prisma.user.findUnique({where:{
                id: UserData.user.id
                }})


    }


}