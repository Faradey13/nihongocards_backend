
import { Column, DataType, Table, Model, BelongsToMany, BeforeCreate } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { UserRoles } from "./user-roles.model";
import { Role } from "./roles.model";
import { Card } from "./cards.model";
import { UserCards } from "./user-cards.model";


interface UserCreationAttrs {
  password: string;
  email: string;
}

@Table({tableName: 'users'})
export class User extends Model<User, UserCreationAttrs> {
    @ApiProperty({example: '1', description:'Уникальный индетификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'email@email.com', description:'Почтовый адрес'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    email: string;

    @ApiProperty({example: 'sv3d1', description:'Пароль'})
    @Column({type: DataType.STRING, allowNull: false})
    password: string;

    @BeforeCreate
    static async setDefaultActivated(model: User){
        model.isActivated = false
    }
    @ApiProperty({example:true, description: 'активирован или нет акаунт'})
    @Column({type: DataType.BOOLEAN})
    isActivated: boolean

    @ApiProperty({example:'sdfsf3-242-dsfsf', description:'уникальная строка для активации акаунта'})
    @Column({type: DataType.STRING})
    activationLink: string

    @ApiProperty({example: true, description:'Забанен или нет'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    banned: boolean;

    @ApiProperty({example: 'за агрессию', description:'причина бана'})
    @Column({type: DataType.STRING, allowNull: true})
    banReason: string;

    @ApiProperty({example:new Date(), description: 'дата последнего урока'})
    @Column({type: DataType.DATE})
    lastLessonDate: Date;


    @BelongsToMany(() => Role, () => UserRoles)
    roles: Role[]

    @BelongsToMany(()=> Card, ()=> UserCards)
    cards: Card[]
}