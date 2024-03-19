import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class RateCardDto {
    @Field()
    grade: number;
    @Field()
    cardId: number;

}