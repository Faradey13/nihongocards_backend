
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



@Table({tableName: 'user_cards', createdAt: false, updatedAt: false})
export class UserCards extends Model<UserCards> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Card)
    @Column({type: DataType.INTEGER})
    cardId: number;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: number;

    @ForeignKey(() => Card)
    @Column({type: DataType.STRING})
    category: string

    @Column({type: DataType.INTEGER})
    factorOfEasiness: number

    @Column({type: DataType.INTEGER})
    interval: number




    @BeforeCreate
    static async setDefault(model: UserCards){
        console.log('Хук @BeforeCreate вызван для модели UserCards');
        console.log('Полученные данные:', model.toJSON());
            model.repetitionNumber = 0

    }
    @Column({type: DataType.INTEGER})
    repetitionNumber: number


    @BeforeCreate
    static async setDefaultCount(model: UserCards){
            model.repetitionCount = 0
    }

    @Column({type: DataType.INTEGER})
    repetitionCount: number




    @BeforeCreate
    static async setDefaultTotalCount(model: UserCards){

            model.totalRepetitionCount = 0

    }

    @Column({type: DataType.INTEGER})
    totalRepetitionCount: number




    @BeforeCreate
    static async setDefaultGrade(model: UserCards){

            model.grade = 0

    }

    @Column({type: DataType.INTEGER})
    grade: number



    @Column({type: DataType.DATE})
    lastRepetition: Date


    @Column({type: DataType.DATE})
    nextRepetition: Date



    @BeforeCreate
    static  setDefaultFlag(model: UserCards){

            model.isNew = true

    }
    @Column({type: DataType.BOOLEAN})
    isNew: boolean





    @BelongsTo(() => Card)
    card: Card;

    @HasMany(() => CurrentLessonCards)
    currentLessonCards: CurrentLessonCards[];



}