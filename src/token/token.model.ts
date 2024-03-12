import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "../users/users.model";
import { ApiProperty } from "@nestjs/swagger";
import { Field, Int, ObjectType } from "@nestjs/graphql";


@Table({tableName: 'users-token'})
@ObjectType()
export class Token extends Model<Token> {

    @ApiProperty({example:1, description: 'уникальный индитификатор'})
    @Field(()=> Int)
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey:true})
    id: number

    @ApiProperty({example:1, description: 'уникальный индитификатор пользователя'})
    @ForeignKey(()=> User)
    @Field(()=> Int)
    @Column({type: DataType.INTEGER})
    userId: number

    @ApiProperty({example:'dsfsfsfs78f6sfsdf6sf', description: 'токен авторизации'})
    @Field(()=> String)
    @Column({type: DataType.TEXT})
    refreshToken: string

    @ApiProperty({example:new Date(), description: 'дата удаления токена'})
    @Field(()=> Date)
    @Column({type: DataType.DATE})
    dateForRemoving: Date

    @BelongsTo(()=> User)
    user: User
}