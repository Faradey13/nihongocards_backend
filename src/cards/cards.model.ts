
import { Column, DataType, Table, Model, BelongsToMany, HasMany } from "sequelize-typescript";
import { UserCards } from "../user-cards/user-cards.model";
import { User } from "../users/users.model";
import { CurrentLessonCards } from "../currentLessonCards/currentLessonCards.model";
import { ApiProperty } from "@nestjs/swagger";
import { Field, ObjectType } from "@nestjs/graphql";


interface CardCreationAttrs {
    word: string;
    translation: string;
    example: string;
    image: string;
    audio: string

}

@Table({tableName: 'cards',timestamps: false})
@ObjectType()
export class Card extends Model<Card, CardCreationAttrs> {

    @ApiProperty({example:1, description: 'уникальный индитификатор'})
    @Field()
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true, })
    id: number;

    @ApiProperty({example:'hello', description:'слово для изучения'})
    @Field()
    @Column({type: DataType.STRING,  allowNull: false})
    word: string;

    @ApiProperty({example:'привет', description: 'перевод слова'})
    @Field()
    @Column({type: DataType.STRING,  allowNull: false})
    translation: string;

    @ApiProperty({example:'hello world', description:'примеры использования слова'})
    @Field({nullable: true})
    @Column({type: DataType.STRING})
    example: string;

    @ApiProperty({example:'hiragana', description: 'категория слова'})
    @Field({nullable: true})
    @Column({type: DataType.STRING, allowNull: false})
    category: string;

    @ApiProperty({example:1, description: 'сложность слова'})
    @Field()
    @Column({type: DataType.INTEGER})
    difficulty: number;

    @ApiProperty({example:`ka.jpg`, description: 'изображение'})
    @Field({ nullable: true })
    @Column({type: DataType.STRING})
    image: string;

    @ApiProperty({example:`ka.mp3`, description: 'файл с звучанием слова'})
    @Field({ nullable: true })
    @Column({type: DataType.STRING})
    audio: string

    @ApiProperty({example:true, description: 'показывать ли карточку передней стороной или обратной для обратного перевода'})
    @Field()
    @Column({type: DataType.BOOLEAN})
    isFront: boolean

    @BelongsToMany(() => User, () => UserCards)
    user: User[]

    @HasMany(() => UserCards,{ onDelete: 'CASCADE' })
    userCards: UserCards[];

    @HasMany(() => CurrentLessonCards, { onDelete: 'CASCADE' })
    currentLessonCards: CurrentLessonCards[];


}