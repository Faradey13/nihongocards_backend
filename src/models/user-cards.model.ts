
import { Column, DataType, Table, Model, BelongsToMany, ForeignKey } from "sequelize-typescript";
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

    @Column({type: DataType.INTEGER})
    levelOfKnowledge: number

    @Column({type: DataType.INTEGER})
    shownFrontCount: number

    @Column({type: DataType.DATE})
    lastTimeFront: Date

    @Column({type: DataType.INTEGER})
    frontScore: number

    @Column({type: DataType.INTEGER})
    shownBackCount: number

    @Column({type: DataType.DATE})
    lastTimeBack: Date

    @Column({type: DataType.INTEGER})
    backScore: number

}