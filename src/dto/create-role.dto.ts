import { IsString } from "class-validator";

export class CreateRoleDto {
  @IsString({message: 'должно быть строкой'})
  readonly value: string;
  @IsString({message: 'должно быть строкой'})
  readonly description: string
}