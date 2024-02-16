import { IsNumber, IsString } from "class-validator";

export class AddRoleDto {
    @IsNumber({},{message: 'доджно быть числом'})
    readonly userID: number;
    @IsString({message: 'должно быть строкой'})
    readonly value: string;

}