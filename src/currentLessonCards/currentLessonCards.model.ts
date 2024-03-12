// noinspection JSUnusedLocalSymbols

import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Card } from "../cards/cards.model";
import { UserCards } from "../user-cards/user-cards.model";
import { ApiProperty } from "@nestjs/swagger";
import { Field, Int, ObjectType } from "@nestjs/graphql";


// noinspection JSUnusedLocalSymbols
@Table({tableName:'currentLessonCards'})
@ObjectType()
export class CurrentLessonCards extends Model<CurrentLessonCards> {

    @ApiProperty({example: '1', description:'Уникальный индетификатор'})
    @Field()
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: '1', description:'Уникальный индетификатор в свойдной таблице пользователь-карты'})
    @ForeignKey(() => UserCards)
    @Field(()=> Int)
    @Column({type: DataType.INTEGER})
    UserCardsId: number;

    @ApiProperty({example: '1', description:'Уникальный индетификатор карточки'})
    @ForeignKey(() => Card)
    @Field(()=> Int)
    @Column({type: DataType.INTEGER})
    cardId: number;

    @ApiProperty({example: '1', description:'Уникальный индетификатор пользователя'})
    @Field(()=> Int)
    @Column({type: DataType.INTEGER})
    userId: number;

    @ApiProperty({example:'hello', description:'слово для изучения'})
    @Field(()=> String)
    @Column({type: DataType.STRING})
    word: string;

    @ApiProperty({example:'привет', description: 'перевод слова'})
    @Field(()=> String)
    @Column({type: DataType.STRING})
    translation: string;

    @ApiProperty({example:'hello world', description:'примеры использования слова'})
    @Field(()=> String, {nullable: true})
    @Column({type: DataType.STRING})
    example: string;

    @ApiProperty({example:'hiragana', description: 'категория слова'})
    @Field(()=> String, {nullable: true})
    @Column({type: DataType.STRING})
    category: string;

    @ApiProperty({example:1, description: 'сложность слова'})
    @Field(()=> Int)
    @Column({type: DataType.INTEGER})
    difficulty: number;


    @ApiProperty({example:`ka.jpg`, description: 'изображение'})
    @Field(()=> String, {nullable: true})
    @Column({type: DataType.STRING})
    image: string;

    @ApiProperty({example:`ka.mp3`, description: 'файл с звучанием слова'})
    @Field(()=> String, {nullable: true})
    @Column({type: DataType.STRING})
    audio: string

    @ApiProperty({example:1, description: 'количество дней в которые изучалось слово'})
    @Field(()=> Int,{nullable: true})
    @Column({type: DataType.INTEGER})
    repetitionNumber: number

    @ApiProperty({example:1, description: 'количество повторений в день'})
    @Field(()=> Int,{nullable: true})
    @Column({type: DataType.INTEGER})
    repetitionCount: number

    @ApiProperty({example:1, description: 'общее количество повторений'})
    @Field(()=> Int,{nullable: true})
    @Column({type: DataType.INTEGER})
    totalRepetitionCount: number


    @ApiProperty({example:1, description: 'оценка пользователя при показе слова'})
    @Field(()=> Int,{nullable: true})
    @Column({type: DataType.FLOAT})
    grade: number


    @ApiProperty({example:true, description: 'показывлось слово хоть раз или нет'})
    @Field(()=> Boolean)
    @Column({type: DataType.BOOLEAN})
    isNew: boolean

    @ApiProperty({example:true, description: 'показывать ли карточку передней стороной или обратной для обратного перевода'})
    @Field(()=> Boolean)
    @Column({type: DataType.BOOLEAN})
    isFront: boolean

    @ApiProperty({example:1, description: 'очередь для показа в текущем уроке'})
    @Field(()=> Int,{nullable: true})
    @Column({ type: DataType.INTEGER })
    position: number;

    @ApiProperty({example:new Date(), description: 'дата текущего урока'})
    @Field(()=> Date,{nullable: true})
    @Column({type: DataType.DATE})
    currentLessonData: Date

    @ApiProperty({example:true, description: 'сложное слово, устанавливается если пользователь его плохо знает после нескольких повторений'})
    @Field(()=> Boolean)
    @Column({type: DataType.BOOLEAN})
    isHard: boolean



    @BelongsTo(() => UserCards)
    userCards: UserCards;

    @BelongsTo(() => Card)
    card: Card; 
}