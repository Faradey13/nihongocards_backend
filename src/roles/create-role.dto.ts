import { IsString } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
@InputType()
export class CreateRoleDto {
  @Field()
  @ApiProperty({example: 'ADMIN', description:'название роли'})
  @IsString({message: 'должно быть строкой'})
  readonly value: string;
  @Field()
  @ApiProperty({example: 'администратор', description:'описание роли'})
  @IsString({message: 'должно быть строкой'})
  readonly description: string
}