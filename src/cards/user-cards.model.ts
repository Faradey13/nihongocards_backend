
import { Column, DataType, Table, Model, BelongsToMany, ForeignKey } from "sequelize-typescript";

import { User } from "../users/users.model";
import { Card } from "./cards.model";


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
    LevelOfKnowledge: number

}