// import { Args, Int, Mutation, Resolver } from "@nestjs/graphql";
// import { Inject } from "@nestjs/common";
// import { PubSub } from "graphql-subscriptions";
// import { CurrentLessonService } from "./currentLessonCards.service";
// import { Card } from "../cards/cards.model";
// import { Card1 } from "../cards/Card1";
//
//
// const pubSub = new PubSub();
//
//
// @Resolver('Lesson')
// export class CurrentLessonSubscribeResolvers {
//     constructor(
//       private lessonService: CurrentLessonService
//     ) {}
//
//     @Mutation(returns => Card1,{name: 'startNewLesson'})
//     async startLesson(@Args('userId', { type: () => Int }) userId: number,) {
//         await this.lessonService.startNewLesson(userId)
//         // await this.lessonService.fillPosition(userId)
//         const card = await this.lessonService.getFirstCard(userId)
//         if(card)
//         await pubSub.publish('LESSON_STARTED', {cardForLEarning: card})
//         return card
//     }
//
// }