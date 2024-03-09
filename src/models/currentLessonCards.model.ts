import { BeforeCreate, BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Card } from "./cards.model";
import { UserCards } from "./user-cards.model";
import { ApiProperty } from "@nestjs/swagger";


@Table({tableName:'currentLessonCards'})
export class CurrentLessonCards extends Model<CurrentLessonCards> {

    @ApiProperty({example: '1', description:'Уникальный индетификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: '1', description:'Уникальный индетификатор в свойдной таблице пользователь-карты'})
    @ForeignKey(() => UserCards)
    @Column({type: DataType.INTEGER})
    UserCardsId: number;

    @ApiProperty({example: '1', description:'Уникальный индетификатор карточки'})
    @ForeignKey(() => Card)
    @Column({type: DataType.INTEGER})
    cardId: number;

    @ApiProperty({example: '1', description:'Уникальный индетификатор пользователя'})
    @Column({type: DataType.INTEGER})
    userId: number;

    @ApiProperty({example:'hello', description:'слово для изучения'})
    @Column({type: DataType.STRING})
    word: string;

    @ApiProperty({example:'привет', description: 'перевод слова'})
    @Column({type: DataType.STRING})
    translation: string;

    @ApiProperty({example:'hello world', description:'примеры использования слова'})
    @Column({type: DataType.STRING})
    example: string;

    @ApiProperty({example:'hiragana', description: 'категория слова'})
    @Column({type: DataType.STRING})
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

    @ApiProperty({example:1, description: 'количество дней в которые изучалось слово'})
    @Column({type: DataType.INTEGER})
    repetitionNumber: number

    @ApiProperty({example:1, description: 'количество повторений в день'})
    @Column({type: DataType.INTEGER})
    repetitionCount: number

    @ApiProperty({example:1, description: 'общее количество повторений'})
    @Column({type: DataType.INTEGER})
    totalRepetitionCount: number


    @ApiProperty({example:1, description: 'оценка пользователя при показе слова'})
    @Column({type: DataType.FLOAT})
    grade: number


    @ApiProperty({example:true, description: 'показывлось слово хоть раз или нет'})
    @Column({type: DataType.BOOLEAN})
    isNew: boolean

    @ApiProperty({example:true, description: 'показывать ли карточку передней стороной или обратной для обратного перевода'})
    @Column({type: DataType.BOOLEAN})
    isFront: boolean

    @ApiProperty({example:1, description: 'очередь для показа в текущем уроке'})
    @Column({ type: DataType.INTEGER })
    position: number;

    @ApiProperty({example:new Date(), description: 'дата текущего урока'})
    @Column({type: DataType.DATE})
    currentLessonData: Date

    @ApiProperty({example:true, description: 'сложное слово, устанавливается если пользователь его плохо знает после нескольких повторений'})
    @Column({type: DataType.BOOLEAN})
    isHard: boolean



    @BelongsTo(() => UserCards)
    userCards: UserCards;

    @BelongsTo(() => Card)
    card: Card; 
}