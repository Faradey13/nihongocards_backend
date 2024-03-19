import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "./users.model";
import { RolesService } from "../roles/roles.service";
import { CreateUserDto } from "./create-user.dto";
import { AddRoleDto } from "../roles/add-role.dto";
import { BanUserDto } from "./ban-user.dto";
import { Card } from "../cards/cards.model";

import { Role } from "../roles/roles.model";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma, cards, roles, user } from "@prisma/client";

export type UserWithRoles = user & {
    roles: roles[];
};

@Injectable()
export class UsersService {
    constructor(
      private prisma: PrismaService,
      private roleService: RolesService
    ) {
    }

    async createUser(dto: CreateUserDto):Promise<UserWithRoles> {
        const user  = await this.prisma.user.create({
            data: {
                ...dto
            }
        });

        const role: roles = await this.roleService.getRoleByValue("USER");

        await this.prisma.userRoles.createMany({
            data: [
                {
                    userId: user.id,
                    roleId: role.id
                }
            ]
        });
        const userWithRoles: UserWithRoles = {
            ...user,
            roles: [role]
        };


        try {
            const cards:cards[] = await this.prisma.cards.findMany();


            const userCardData = cards.map((card) => ({
                userId: user.id,
                cardId: card.id
            }));

            for (const data of userCardData) {
                await this.prisma.userCards.create({
                      data: {
                          cardId: data.cardId,
                          userId: data.userId,


                      }
                  }
                );
            }

        } catch (e) {
            throw new HttpException(`Ошибка добавления карт пользователю: ${e.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return userWithRoles;
    }

    async getAllUsers() {
        return this.prisma.user.findMany();
    }

    async getUserByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email: email } });

    }

    async geUserById(id: number) {
        return this.prisma.user.findUnique({ where: { id: id } });
    }


    async addRole(dto: AddRoleDto) {
        const user = await this.prisma.user.findUnique({ where: { id: dto.userID } });
        const role = await this.roleService.getRoleByValue(dto.value);
        if (role && user) {
            await this.prisma.userRoles.create({ data: {
                    roleId: role.id,
                    userId: user.id
                    }

            });
            return dto;
        }
        throw new HttpException("Пользователь или роль не найдены", HttpStatus.NOT_FOUND);
    }

    async ban(dto: BanUserDto) {
        const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
        if (!user) {
            throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND);
        }
        user.banned = true;
        user.banReason = dto.banReason;
        await this.prisma.user.update({
            where: { id: user.id }, data: {
                ...user
            }
        });
        return user;
    }

    async  getUserWithRoles(userId: number) {
        const userWithRoles = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                userRoles: {
                    include: {
                        roles: true,
                    },
                },
            },
        });

        if (!userWithRoles) {
            throw new Error(`User with ID ${userId} not found.`);
        }

        const transformedRoles = userWithRoles.userRoles.map(role => role.roles);

        return {
            ...userWithRoles,
            roles: transformedRoles,
        };
    }
}
