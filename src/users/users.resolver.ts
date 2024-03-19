import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { User } from "./users.model";
import { HttpException, HttpStatus } from "@nestjs/common";
import { Role } from "../roles/roles.model";
import { AddRoleDto } from "../roles/add-role.dto";
import { BanUserDto } from "./ban-user.dto";
import { UserCardsService } from "../user-cards/user-cards.service";


@Resolver('User')
export class UsersResolver{
    constructor(
      private usersService: UsersService,
      private userCardsService: UserCardsService
    ) {}

    @Query(() => [User])
    async getAllUsers(){
        return this.usersService.getAllUsers()
    }

    @Query(() => User)
    async getUserById(@Args('id') id: number) {
        try {
            const user =    await this.usersService.geUserById(id);
            console.log(user)
            return user


        } catch (error) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
    }

    @Mutation(() => Role)
    async getRole(@Args('role') dto: AddRoleDto){
        return this.usersService.addRole(dto)
    }

    @Mutation(() => User)
    async banUser(@Args('ban') dto: BanUserDto){
        return this.usersService.ban(dto)
    }

    @Mutation(() => User)
    async changeLimits(@Args('limits') oldLimit: number, newLimit: number, userId: number){
        return this.userCardsService.changeLimits(oldLimit,newLimit, userId)
    }

}