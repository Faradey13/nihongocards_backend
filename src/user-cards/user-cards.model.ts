
import { Card } from "../cards/cards.model";
import { User } from "../users/users.model";
import { CurrentLessonCards } from "../currentLessonCards/currentLessonCards.model";
import { Field, ObjectType } from "@nestjs/graphql";


@ObjectType()
export class UserCards{

    @Field()
    id: number;

    @Field()
    cardId: number;

    @Field()
    userId: number;

    @Field()
    factorOfEasiness: number

    @Field( {nullable: true})
    interval: number

    @Field()
    repetitionNumber: number

    @Field()
    repetitionCount: number

    @Field()
    totalRepetitionCount: number

    @Field()
    grade: number

    @Field({nullable: true,})
    lastRepetition: Date

    @Field( {nullable: true})
    nextRepetition: Date

    @Field( )
    isNew: boolean

    @Field( )
    isHard: boolean


    @Field(()=>[User])
    user: User[]
    @Field(() => [Card])
    card: Card[];
    @Field(()=> [CurrentLessonCards])
    currentLessonCards: CurrentLessonCards[];



}