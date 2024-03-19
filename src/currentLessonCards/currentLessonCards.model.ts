
import { Card } from "../cards/cards.model";
import { UserCards } from "../user-cards/user-cards.model";
import { Field, Int, ObjectType } from "@nestjs/graphql";




@ObjectType()
export class CurrentLessonCards {

    @Field()
    id: number;

    @Field(()=> Int)
    UserCardsId: number;

    @Field(()=> Int)
    cardId: number;


    @Field(()=> Int)
    userId: number;

    @Field(()=> Int,{nullable: true})
    repetitionCount: number

    @Field(()=> Int,{nullable: true})
    grade: number

    @Field(()=> Int,{nullable: true})
    position: number;

    @Field(()=> Date,{nullable: true})
    currentLessonData: Date

    @Field(()=>[UserCards])
    userCards: UserCards[];
    @Field(()=>[Card])
    card: Card[];
}