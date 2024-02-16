import { IsNumber, IsString } from "class-validator";

export class BanUserDto {
    @IsNumber({},{message: 'доджно быть числом'})
    readonly userId : number;
    @IsString({message: 'должно быть строкой'})
    readonly banReason : string
}