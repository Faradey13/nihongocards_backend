import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
@InputType()
export class UpdateCardDto {
    @Field()
    @ApiProperty({example: 1, description:'id'})
    @IsNumber()
    id: number;

    @Field()
    @ApiProperty({example: 'Hello', description:'слово'})
    @IsString({message: 'должно быть строкой'})
    word: string;

     @Field()
    @ApiProperty({example: 'Привет', description:'перевод'})
    @IsString({message: 'должно быть строкой'})
    translation: string;

    @Field()
    @ApiProperty({example: 'hello world', description:'примеры использования'})
    @IsString({message: 'должно быть строкой'})
    example: string;

    @Field()
    @ApiProperty({example: 'hiragana', description:'категория'})
    @IsString({message: 'должно быть строкой'})
    category: string;

    @Field()
    @ApiProperty({example: 1, description:'сложность'})
    @IsNumber()
    difficulty: number;

    @Field()
    @ApiProperty({example: 'da.img', description:'название картинки из БД'})
    @IsString({message: 'должно быть строкой'})
    image: string;

    @Field()
    @ApiProperty({example: 'da.mp3', description:'название аудио из БД'})
    @IsString({message: 'должно быть строкой'})
    audio: string
}