import { BeforeCreate, BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Card } from "./cards.model";
import { UserCards } from "./user-cards.model";


@Table({tableName:'currentLessonCards', timestamps:  false})
export class CurrentLessonCards extends Model<CurrentLessonCards> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => UserCards)
    @Column({type: DataType.INTEGER})
    UserCardsId: number;


    @ForeignKey(() => Card)
    @Column({type: DataType.INTEGER})
    cardId: number;

    @Column({type: DataType.INTEGER})
    userId: number;


    @Column({type: DataType.STRING})
    word: string;


    @Column({type: DataType.STRING})
    translation: string;


    @Column({type: DataType.STRING})
    example: string;


    @Column({type: DataType.STRING})
    category: string;


    @Column({type: DataType.INTEGER})
    difficulty: number;



    @Column({type: DataType.STRING})
    image: string;


    @Column({type: DataType.STRING})
    audio: string

    @Column({type: DataType.INTEGER})
    repetitionNumber: number


    @Column({type: DataType.INTEGER})
    repetitionCount: number


    @Column({type: DataType.INTEGER})
    totalRepetitionCount: number



    @Column({type: DataType.INTEGER})
    grade: number



    @Column({type: DataType.BOOLEAN})
    isNew: boolean


    @Column({type: DataType.INTEGER, unique: true})
    position: number
    @BeforeCreate
    static async fillPosition(model: CurrentLessonCards){
        const maxId = await CurrentLessonCards.max("id")
        model.position = maxId ? (maxId as number) + 1 : 1;
    }


    @BelongsTo(() => UserCards)
    userCards: UserCards;

    @BelongsTo(() => Card)
    card: Card; 
}