
import { Column, DataType, Table, Model, ForeignKey } from "sequelize-typescript";
import { Card } from "./cards.model";
import { User } from "./users.model";



@Table({tableName: 'user_cards', createdAt: false, updatedAt: false})
export class UserCards extends Model<UserCards> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Card)
    @Column({type: DataType.INTEGER})
    cardId: number;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    UserId: number;

    @ForeignKey(() => Card)
    @Column({type: DataType.STRING})
    category: string

    @Column({type: DataType.INTEGER})
    factorOfEasiness: number

    @Column({type: DataType.INTEGER})
    interval: number

    @Column({type: DataType.INTEGER})
    repetitionCount: number

    @Column({type: DataType.DATE})
    lastRepetition: Date


    @Column({type: DataType.DATE})
    nextRepetition: Date

    @Column({type: DataType.BOOLEAN})
    isNew: boolean

}