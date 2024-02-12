import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({example: 'email@email.com', description:'Почта'})
  readonly email: string;
  @ApiProperty({example: 'аа4341', description:'Пароль'})
  readonly password: string;
}