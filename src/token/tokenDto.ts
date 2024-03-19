import { Field, InputType, Int } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsString } from "class-validator";
import {roles} from "@prisma/client";
import { Role } from "../roles/roles.model";


@InputType()
export class TokenDto {
    @Field()
    @ApiProperty({example: 'email@email.com', description:'Почта'})
    @IsString({message: 'должно быть строкой'})
    readonly email: string;
    @Field(() => Int)
    @ApiProperty({example: 1, description:'уникальный индитификатор '})
    @IsNumber({},{message: 'должно быть числом'})
    readonly id: number;
    @Field(()=> [Role])
    @ApiProperty({example: [], description:'массив данных роли'})
    readonly roles: roles[];
    @Field()
    @ApiProperty({example: true, description:'активирован ли акаунт'})
    @IsBoolean({message: 'true or false'})
    readonly isActivated: boolean
}