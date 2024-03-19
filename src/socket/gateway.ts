import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { CurrentLessonService } from "../currentLessonCards/currentLessonCards.service";
import { GetCardDto } from "../currentLessonCards/getCard.dto";
import { UserCardsService } from "../user-cards/user-cards.service";
import { RateCardDto } from "../currentLessonCards/rateCard.dto";
import { PrismaService } from "../prisma/prisma.service";
import { add } from "date-fns";


@WebSocketGateway(5002, { transports: ['polling'] })
export class AppGateway  {
    @WebSocketServer() server: Server



    private activeUserConnection: Map<string,string> = new Map<string, string>()

    constructor(private readonly currentLessonCardsService: CurrentLessonService,
                private prisma: PrismaService,
                private userCardsService: UserCardsService) {
    }


    handleConnection(client: Socket, ...args: any[]){
        console.log(args)
        const userIdHeaderValue = client.handshake.headers['user-id'];
        console.log(userIdHeaderValue)
        const userID = typeof userIdHeaderValue === 'string' ? userIdHeaderValue : userIdHeaderValue[0];
        client['userId'] = userID;
        console.log(`Пользователь ${userID} подключился`);
        this.activeUserConnection.set(userID, client.id);

        if( this.activeUserConnection.has(userID)){
            this.activeUserConnection.set(userID, client.id)
        } else {
            client.emit('ошибка подключения, возможно пользователь уже подключен')
            client.disconnect()
            console.log(`Пользователь отключился`);

        }
    }
    handleDisconnection(client: Socket) {
        const userId = Array.from(this.activeUserConnection.entries()).find(([value]) => value=== client.id)?.[0]
        if(userId) {
            this.activeUserConnection.delete(userId)
            console.log(`Пользователь отключился`);
        }
    }

    @SubscribeMessage('rateCard')
    async handleRateCard(client: Socket, dto: RateCardDto) {
        console.log('оценка получена', dto.cardId)

        const userId: number = Number(client['userId'])

        await this.currentLessonCardsService.updateCard(dto, userId)
        console.log('карты обновлены')

        const newCard = await this.currentLessonCardsService.getFirstCard(userId)
        if(newCard) {
            client.emit('newCard', newCard)

        } else {
            client.emit('endLesson', 'вы изучили все карточки на сегодня, увеличте лимиты если хотите учить больше')

        }
    }

    @SubscribeMessage('hello')
    async hello(client: Socket){
        console.log('world')
    }

    @SubscribeMessage('startLearning')
    async handleStartLearning(client: Socket, dto: GetCardDto) {

        const today = (new Date());
        const user = await this.prisma.user.findUnique({where:{id: dto.userId}})
        const lastLessonUser = user.lastLessonDate
        if (lastLessonUser) {
            const yearDiff = today.getFullYear() - lastLessonUser.getFullYear();
            const monthDiff = today.getMonth() - lastLessonUser.getMonth();
            const dayDiff = today.getDate() - lastLessonUser.getDate();

            if (yearDiff !== 0 || monthDiff !== 0 || dayDiff > 2) {
                if (yearDiff !== 0) {
                    console.log("Вы долго не учились, рекомендуется сбросить прогресс и начать заново");
                    client.on('resetProgressResponse', async(data) =>{
                        if(data.confirm){
                            await this.userCardsService.refreshProgress(dto.userId)
                        }
                    })

                }
                if(monthDiff > 3 && yearDiff===0) {
                    console.log("Вы долго не учились, рекомендуется сбросить прогресс и начать заново")
                    client.on('resetProgressResponse', async(data) =>{
                        if(data.confirm){
                            await this.userCardsService.refreshProgress(dto.userId)
                        }
                    })
                }

                const dateDiff = today.getTime() - lastLessonUser.getTime();
                const dayDiff = Math.floor(dateDiff / (1000 * 60 * 60 * 24));
                const newDate = add(new Date(), { days: dayDiff });

                await this.prisma.userCards.updateMany({
                    data: {
                        nextRepetition: newDate
                    },
                    where: {
                        nextRepetition: { not: null }
                    }
                });
            }
        }



        const result = await this.currentLessonCardsService.startNewLesson(dto.userId)
        if(typeof result === 'string') {
            client.emit('endLesson', result);
        } else {
            const firstCard = await this.currentLessonCardsService.getFirstCard(dto.userId);
            client.emit('newCard', firstCard);
        }

    }
    @SubscribeMessage('resetProgressRequest')
    async handleResetProgressRequest(client: Socket) {
        client.emit('resetProgressRequest', {confirm: true})
    }

}