
import { Role } from "../roles/roles.model";
import { Card } from "../cards/cards.model";
import { Field, Int, ObjectType } from "@nestjs/graphql";


@ObjectType()
export class User{
    @Field(() => Int, { nullable: true })
    id: number;

    @Field(() => String, { nullable: true })
    email: string;

    @Field(() => String)
    password: string;

    @Field(() => Boolean)
    isActivated: boolean

    @Field(() => String)
    activationLink?: string

    @Field(() => Boolean)
    banned: boolean;

    @Field({ nullable: true })
    banReason?: string;

    @Field({ nullable: true })
    lastLessonDate?: Date;

    @Field(() => Int)
    newLimit: number;

    @Field(() => Int)
    oldLimit: number;


    roles: Role[]
    cards: Card[]
}