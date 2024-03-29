import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateUserDto {
  @Field()
  @ApiProperty({example: 'email@email.com', description:'Почта'})
  @IsString({message: 'неверные параметры ввода'})
  @IsEmail({},{message: 'некоректный email'})
  readonly email: string;
  @Field()
  @ApiProperty({example: 'аа4341', description:'Пароль'})
  @IsString({message: 'неверные параметры ввода'})
  @Length(4, 16, {message : 'не меньше 4 не больше 16'})
  readonly password: string;

  readonly activationLink: string
}