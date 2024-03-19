
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { User } from "../users/users.model";
import { Role } from "./roles.model";

@ObjectType()
export class UserRoles {

  @Field(()=> Int)
  id: number;


  @Field(()=> Int)
  roleId: number;

  @Field(()=> Int)
  UserId: number;

  @Field(() => [User])
  user: User[];

  @Field(() => [Role])
  role: Role[];

}