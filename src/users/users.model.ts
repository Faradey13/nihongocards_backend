
import { Column, DataType, Table, Model, BelongsToMany, BeforeCreate } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { UserRoles } from "../roles/user-roles.model";
import { Role } from "../roles/roles.model";
import { Card } from "../cards/cards.model";
import { UserCards } from "../user-cards/user-cards.model";
import { Field, Int, ObjectType } from "@nestjs/graphql";


interface UserCreationAttrs {
  password: string;
  email: string;
}

@Table({tableName: 'users'})
@ObjectType()
export class User extends Model<User, UserCreationAttrs> {
    @ApiProperty({example: '1', description:'Уникальный индетификатор'})
    @Field(() => Int)
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'email@email.com', description:'Почтовый адрес'})
    @Field(() => String)
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    email: string;

    @ApiProperty({example: 'sv3d1', description:'Пароль'})
    @Field(() => String)
    @Column({type: DataType.STRING, allowNull: false})
    password: string;

    @BeforeCreate
    static async setDefaultActivated(model: User){
        model.isActivated = false
    }
    @ApiProperty({example:true, description: 'активирован или нет акаунт'})
    @Field(() => Boolean)
    @Column({type: DataType.BOOLEAN})
    isActivated: boolean

    @ApiProperty({example:'sdfsf3-242-dsfsf', description:'уникальная строка для активации акаунта'})
    @Field(() => String)
    @Column({type: DataType.STRING})
    activationLink: string

    @ApiProperty({example: true, description:'Забанен или нет'})
    @Field(() => Boolean)
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    banned: boolean;

    @ApiProperty({example: 'за агрессию', description:'причина бана'})
    @Field({ nullable: true })
    @Column({type: DataType.STRING, allowNull: true})
    banReason: string;

    @ApiProperty({example:new Date(), description: 'дата последнего урока'})
    @Field({ nullable: true })
    @Column({type: DataType.DATE})
    lastLessonDate: Date;


    @BelongsToMany(() => Role, () => UserRoles)
    roles: Role[]

    @BelongsToMany(()=> Card, ()=> UserCards)
    cards: Card[]
}