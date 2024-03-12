import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { CurrentLessonCardsService } from "../currentLessonCards/currentLessonCards.service";
import { GetCardDto } from "../currentLessonCards/getCard.dto";
import sequelize, { Op } from "sequelize";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "../users/users.model";
import { UserCardsService } from "../user-cards/user-cards.service";
import { UserCards } from "../user-cards/user-cards.model";
import { RateCardDto } from "../currentLessonCards/rateCard.dto";


@WebSocketGateway(5002, { transports: ['polling'] })
export class AppGateway  {
    @WebSocketServer() server: Server



    private activeUserConnection: Map<string,string> = new Map<string, string>()

    constructor(private readonly currentLessonCardsService: CurrentLessonCardsService,
                @InjectModel(User) private userRepository: typeof User,
                @InjectModel(UserCards) private userCardsRepository: typeof UserCards,
                private userCardsService: UserCardsService) {
    }


    handleConnection(client: Socket, ...args: any[]){
        console.log(args)
        const userIdHeaderValue = client.handshake.headers['user-id'];
        console.log(userIdHeaderValue)
        const userID = typeof userIdHeaderValue === 'string' ? userIdHeaderValue : userIdHeaderValue[0];
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
        console.log('оценка получена', dto)

        const userId = dto.userId
        console.log(dto)
        await this.currentLessonCardsService.updateCard(dto)
        console.log('карты обновлены')

        const newCard = await this.currentLessonCardsService.getFirstCard(userId)

        client.emit('newCard', newCard)
    }

    @SubscribeMessage('hello')
    async hello(client: Socket){
        console.log('world')
    }

    @SubscribeMessage('startLearning')
    async handleStartLearning(client: Socket, dto: GetCardDto) {





        const today = (new Date());
        const user = await this.userRepository.findOne({where:{id: dto.userId}})
        const lastLessonUser = user.lastLessonDate
        if (lastLessonUser) {
            const yearDiff = today.getFullYear() - lastLessonUser.getFullYear();
            const monthDiff = today.getMonth() - lastLessonUser.getMonth();
            const dayDiff = today.getDate() - lastLessonUser.getDate();

            if (yearDiff !== 0 || monthDiff !== 0 || dayDiff !== 0) {
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
                const dayDiff = Math.floor(dateDiff / (1000 * 60 * 60 * 24)); // Разница в днях

                await this.userCardsRepository.update({
                    nextRepetition: sequelize.literal(`nextRepetition + INTERVAL ${dayDiff} DAY`)
                }, {
                    where: {
                        nextRepetition: { [Op.not]: null }
                    }
                });
            }
        }



        await this.currentLessonCardsService.startNewLesson(dto)
        const firstCard = await this.currentLessonCardsService.getFirstCard(dto.userId);
        client.emit('newCard', firstCard);
    }
    @SubscribeMessage('resetProgressRequest')
    async handleResetProgressRequest(client: Socket) {
        client.emit('resetProgressRequest', {confirm: true})
    }

}