import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "./users.model";


@Table({tableName: 'users-token'})
export class Token extends Model<Token> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey:true})
    id: number

    @ForeignKey(()=> User)
    @Column({type: DataType.INTEGER})
    userId: number

    @Column({type: DataType.STRING})
    refreshToken: string

    @Column({type: DataType.DATE})
    dateForRemoving: Date

    @BelongsTo(()=> User)
    user: User
}

