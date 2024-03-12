import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsString } from "class-validator";
import { Role } from "../roles/roles.model";


@InputType()
export class TokenDto {
    @Field()
    @ApiProperty({example: 'email@email.com', description:'Почта'})
    @IsString({message: 'должно быть строкой'})
    readonly email: string;
    @Field()
    @ApiProperty({example: 1, description:'уникальный индитификатор '})
    @IsNumber({},{message: 'должно быть числом'})
    readonly id: number;
    @Field()
    @ApiProperty({example: [], description:'массив данных роли'})
    readonly roles: Role;
    @Field()
    @ApiProperty({example: true, description:'активирован ли акаунт'})
    @IsBoolean({message: 'true or false'})
    readonly isActivated: boolean

    constructor(model: TokenDto) {
        this.id = model.id;
        this.roles = model.roles;
        this.email = model.email;
        this.isActivated = model.isActivated;
    }
}