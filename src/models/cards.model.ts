
import { Column, DataType, Table, Model, BelongsToMany, HasMany } from "sequelize-typescript";
import { UserCards } from "./user-cards.model";
import { User } from "./users.model";
import { CurrentLessonCards } from "./currentLessonCards.model";


interface CardCreationAttrs {
    word: string;
    translation: string;
    example: string;
    image: string;
    audio: string

}

@Table({tableName: 'cards',timestamps: false})
export class Card extends Model<Card, CardCreationAttrs> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true, })
    id: number;

    @Column({type: DataType.STRING,  allowNull: false})
    word: string;

    @Column({type: DataType.STRING,  allowNull: false})
    translation: string;

    @Column({type: DataType.STRING})
    example: string;

    @Column({type: DataType.STRING, allowNull: false})
    category: string;

    @Column({type: DataType.INTEGER})
    difficulty: number;


    @Column({type: DataType.STRING})
    image: string;

    @Column({type: DataType.STRING})
    audio: string

    @BelongsToMany(() => User, () => UserCards)
    user: User[]

    @HasMany(() => UserCards)
    userCards: UserCards[];

    @HasMany(() => CurrentLessonCards)
    currentLessonCards: CurrentLessonCards[];


}