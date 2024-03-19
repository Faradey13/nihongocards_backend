
import { UserCards } from "../user-cards/user-cards.model";
import { User } from "../users/users.model";
import { CurrentLessonCards } from "../currentLessonCards/currentLessonCards.model";
import { Field, ObjectType } from "@nestjs/graphql";



@ObjectType()
export class Card{
    @Field()
    id: number;

    @Field()
    word: string;

    @Field()
    translation: string;

    @Field({nullable: true})
    example: string;

    @Field({nullable: true})
    category: string;

    @Field()
    difficulty: number;

    @Field({ nullable: true })
    image: string;

    @Field({ nullable: true })
    audio: string


    @Field()
    isFront: boolean

    @Field(()=>[User])
    user: User[]
    @Field(()=>[UserCards])
    userCards: UserCards[];
    @Field(()=>[CurrentLessonCards])
    currentLessonCards: CurrentLessonCards[];


}