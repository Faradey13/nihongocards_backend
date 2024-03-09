
import {
    Column,
    DataType,
    Table,
    Model,
    ForeignKey,
    HasMany,
    BelongsTo,
    BeforeCreate,

} from "sequelize-typescript";
import { Card } from "./cards.model";
import { User } from "./users.model";
import { CurrentLessonCards } from "./currentLessonCards.model";
import { ApiProperty } from "@nestjs/swagger";



@Table({tableName: 'user_cards', createdAt: false, updatedAt: false})
export class UserCards extends Model<UserCards> {

    @ApiProperty({example: '1', description:'Уникальный индетификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: '1', description:'Уникальный индетификатор карточки'})
    @ForeignKey(() => Card)
    @Column({type: DataType.INTEGER})
    cardId: number;

    @ApiProperty({example: '1', description:'Уникальный индетификатор пользователя'})
    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: number;

    @ApiProperty({example:'hiragana', description: 'категория слова'})
    @ForeignKey(() => Card)
    @Column({type: DataType.STRING})
    category: string

    @BeforeCreate
    static async setFactor(model: UserCards){
        model.factorOfEasiness = 2.5

    }
    @ApiProperty({example:1, description: 'степень легкости слвоа по который вычесляется интервал'})
    @Column({type: DataType.FLOAT})
    factorOfEasiness: number

    @ApiProperty({example:1, description: 'количество дней через которое будет показано слово'})
    @Column({type: DataType.INTEGER})
    interval: number


    @BeforeCreate
    static async setDefault(model: UserCards){
            model.repetitionNumber = 0

    }
    @ApiProperty({example:1, description: 'количество дней в которые изучалось слово'})
    @Column({type: DataType.INTEGER})
    repetitionNumber: number


    @BeforeCreate
    static async setDefaultCount(model: UserCards){
            model.repetitionCount = 0
    }

    @ApiProperty({example:1, description: 'количество повторений в день'})
    @Column({type: DataType.INTEGER})
    repetitionCount: number




    @BeforeCreate
    static async setDefaultTotalCount(model: UserCards){

            model.totalRepetitionCount = 0

    }

    @ApiProperty({example:1, description: 'общее количество повторений'})
    @Column({type: DataType.INTEGER})
    totalRepetitionCount: number




    @BeforeCreate
    static async setDefaultGrade(model: UserCards){

            model.grade = 0

    }

    @ApiProperty({example:1, description: 'средняя оценка пользователя знания слова за все повторения'})
    @Column({type: DataType.FLOAT})
    grade: number


    @ApiProperty({example:new Date(), description: 'дата последнего изучения слова'})
    @Column({type: DataType.DATE})
    lastRepetition: Date

    @ApiProperty({example:new Date(), description: 'дата следующего дня когда слово будет показано'})
    @Column({type: DataType.DATE})
    nextRepetition: Date



    @BeforeCreate
    static  setDefaultFlag(model: UserCards){

            model.isNew = true

    }

    @ApiProperty({example:true, description: 'показывлось слово хоть раз или нет'})
    @Column({type: DataType.BOOLEAN})
    isNew: boolean
    @BeforeCreate
    static  setDefaultFlagHard(model: UserCards) {

        model.isHard = false
    }
    @ApiProperty({example:true, description: 'сложное слово, устанавливается если пользователь его плохо знает после нескольких повторений'})
    @Column({type: DataType.BOOLEAN})
    isHard: boolean





    @BelongsTo(() => Card)
    card: Card;

    @HasMany(() => CurrentLessonCards)
    currentLessonCards: CurrentLessonCards[];



}