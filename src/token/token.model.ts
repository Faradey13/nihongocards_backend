import { User } from "../users/users.model";
import { Field, Int, ObjectType } from "@nestjs/graphql";



@ObjectType()
export class Token{

    @Field(()=> Int)
    id: number

    @Field(()=> Int)
    userId: number

    @Field(()=> String)
    refreshToken: string

    @Field(()=> Date)
    dateForRemoving: Date

    @Field(()=>[User])
    user: User[]
}