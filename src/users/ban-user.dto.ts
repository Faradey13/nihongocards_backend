import { IsNumber, IsString } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";


@InputType()
export class BanUserDto {
    @Field()
    @ApiProperty({example: 1, description:'уникальный индитификатор пльзователя'})
    @IsNumber({},{message: 'должно быть числом'})
    readonly userId : number;

    @Field()
    @ApiProperty({example: 'за идиотизм', description:'причина бана'})
    @IsString({message: 'должно быть строкой'})
    readonly banReason : string
}