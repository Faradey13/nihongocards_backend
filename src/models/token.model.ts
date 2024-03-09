import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "./users.model";
import { ApiProperty } from "@nestjs/swagger";


@Table({tableName: 'users-token'})
export class Token extends Model<Token> {

    @ApiProperty({example:1, description: 'уникальный индитификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey:true})
    id: number

    @ApiProperty({example:1, description: 'уникальный индитификатор пользователя'})
    @ForeignKey(()=> User)
    @Column({type: DataType.INTEGER})
    userId: number

    @ApiProperty({example:'dsfsfsfs78f6sfsdf6sf', description: 'токен авторизации'})
    @Column({type: DataType.TEXT})
    refreshToken: string

    @ApiProperty({example:new Date(), description: 'дата удаления токена'})
    @Column({type: DataType.DATE})
    dateForRemoving: Date

    @BelongsTo(()=> User)
    user: User
}