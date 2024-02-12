
import { Column, DataType, Table, Model, BelongsToMany, ForeignKey } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../users/users.model";
import { UserRoles } from "../users/user-roles.model";

interface RoleCreationAttrs {
    value: string;
    description: string;
}

@Table({tableName: 'user_roles'})
export class Role extends Model<Role, RoleCreationAttrs> {

    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ForeignKey(() => Role)
    @Column({ type: DataType.INTEGER })
    roleId: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.STRING })
    UserId: string;

    @BelongsToMany(() => Role, () => UserRoles)
    roles: Role[]
}
