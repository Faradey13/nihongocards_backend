import { IsNumber, IsString } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
@InputType()
export class AddRoleDto {
    @Field()
    @ApiProperty({example: 1, description:'уникальный индитификатор пльзователя'})
    @IsNumber({},{message: 'должно быть числом'})
    readonly userID: number;
    @Field()
    @ApiProperty({example: 'ADMIN', description:'название роли'})
    @IsString({message: 'должно быть строкой'})
    readonly value: string;

}