import { Field, ObjectType } from "@nestjs/graphql";
import { Card } from "../cards/cards.model";
import { User } from "./users.model";

@ObjectType()
export class UserLimit {
    @Field()
    id: number;

    @Field()
    userId: number;

    @Field()
    todayLimitNew: string;

    @Field()
    todayLimitOld: string;

    @Field()
    today: Date

    @Field(()=>[User])
    user: User[];
}