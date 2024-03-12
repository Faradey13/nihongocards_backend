
import { Column, DataType, Table, Model, ForeignKey } from "sequelize-typescript";
import { Role } from "./roles.model";
import { User } from "../users/users.model";
import { ApiProperty } from "@nestjs/swagger";



@Table({tableName: 'user_roles', createdAt: false, updatedAt: false})
export class UserRoles extends Model<UserRoles> {

  @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
  @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
  id: number;

  @ApiProperty({example: '1', description: 'Уникальный идентификатор роли'})
  @ForeignKey(() => Role)
  @Column({type: DataType.INTEGER})
  roleId: number;

  @ApiProperty({example: '1', description: 'Уникальный идентификатор пользователя'})
  @ForeignKey(() => User)
  @Column({type: DataType.INTEGER})
  UserId: number;

}