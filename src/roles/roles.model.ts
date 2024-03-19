
import { User } from "../users/users.model";
import { Field, Int, ObjectType } from "@nestjs/graphql";

interface RoleCreationAttrs {
    value: string;
    description: string;
}

@ObjectType()
export class Role  {
    @Field(()=> Int)
    id: number;

    @Field(()=> String)
    value: string;

    @Field(()=> String)
    description: string;

    @Field(()=>[User])
    users: User[];
}