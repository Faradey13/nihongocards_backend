
import { Column, DataType, Table, Model, BelongsToMany, HasMany } from "sequelize-typescript";
import { UserCards } from "./user-cards.model";
import { User } from "./users.model";
import { CurrentLessonCards } from "./currentLessonCards.model";
import { ApiProperty } from "@nestjs/swagger";


interface CardCreationAttrs {
    word: string;
    translation: string;
    example: string;
    image: string;
    audio: string

}

@Table({tableName: 'cards',timestamps: false})
export class Card extends Model<Card, CardCreationAttrs> {

    @ApiProperty({example:1, description: 'уникальный индитификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true, })
    id: number;

    @ApiProperty({example:'hello', description:'слово для изучения'})
    @Column({type: DataType.STRING,  allowNull: false})
    word: string;

    @ApiProperty({example:'привет', description: 'перевод слова'})
    @Column({type: DataType.STRING,  allowNull: false})
    translation: string;

    @ApiProperty({example:'hello world', description:'примеры использования слова'})
    @Column({type: DataType.STRING})
    example: string;

    @ApiProperty({example:'hiragana', description: 'категория слова'})
    @Column({type: DataType.STRING, allowNull: false})
    category: string;

    @ApiProperty({example:1, description: 'сложность слова'})
    @Column({type: DataType.INTEGER})
    difficulty: number;

    @ApiProperty({example:`ka.jpg`, description: 'изображение'})
    @Column({type: DataType.STRING})
    image: string;

    @ApiProperty({example:`ka.mp3`, description: 'файл с звучанием слова'})
    @Column({type: DataType.STRING})
    audio: string

    @ApiProperty({example:true, description: 'показывать ли карточку передней стороной или обратной для обратного перевода'})
    @Column({type: DataType.BOOLEAN})
    isFront: boolean

    @BelongsToMany(() => User, () => UserCards)
    user: User[]

    @HasMany(() => UserCards,{ onDelete: 'CASCADE' })
    userCards: UserCards[];

    @HasMany(() => CurrentLessonCards, { onDelete: 'CASCADE' })
    currentLessonCards: CurrentLessonCards[];


}