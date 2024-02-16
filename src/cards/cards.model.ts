
import { Column, DataType, Table, Model, BelongsToMany } from "sequelize-typescript";
import { User } from "../users/users.model";
import { UserCards } from "./user-cards.model";

interface CardCreationAttrs {
    word: string;
    translation: string;
    example: string;
    image: string;
    audio: string;
}

@Table({tableName: 'cards'})
export class Card extends Model<Card, CardCreationAttrs> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    word: string;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    translation: string;

    @Column({type: DataType.STRING, allowNull: false})
    example: string;


    @Column({type: DataType.STRING, allowNull: false})
    image: string;

    @Column({type: DataType.STRING, allowNull: false})
    audio: string

    @BelongsToMany(() => User, () => UserCards)
    user: User[]
}