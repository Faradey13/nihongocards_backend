import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { CurrentLessonCardsService } from "../services/currentLessonCards.service";
import { GetCardDto } from "../dto/getCard.dto";
import sequelize, { Op } from "sequelize";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "../models/users.model";
import { UserCardsService } from "../services/user-cards.service";
import { UserCards } from "../models/user-cards.model";


@WebSocketGateway(5001)
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
        }
    }
    handleDisconnection(client: Socket) {
        const userId = Array.from(this.activeUserConnection.entries()).find(([value]) => value=== client.id)?.[0]
        if(userId) {
            this.activeUserConnection.delete(userId)
        }
    }

    @SubscribeMessage('rateCard')
    async handleRateCard(client: Socket, dto: string) {
        console.log('оценка получена', dto)
        const dtoObj = JSON.parse(dto)
        const userId = dtoObj.userId
        console.log(dtoObj)
        await this.currentLessonCardsService.updateCard(dtoObj)

        const newCard = await this.currentLessonCardsService.getFirstCard(userId)

        client.emit('newCard', newCard)
    }

    @SubscribeMessage('startLearning')
    async handleStartLearning(client: Socket, dto: string) {

        const dtoObj = JSON.parse(dto)

        const today = (new Date());
        const user = await this.userRepository.findOne({where:{id: dtoObj.userId}})
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
                            await this.userCardsService.refreshProgress(dtoObj.userId)
                        }
                    })

                }
                if(monthDiff > 3 && yearDiff===0) {
                    console.log("Вы долго не учились, рекомендуется сбросить прогресс и начать заново")
                    client.on('resetProgressResponse', async(data) =>{
                        if(data.confirm){
                            await this.userCardsService.refreshProgress(dtoObj.userId)
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



        await this.currentLessonCardsService.startNewLesson(dtoObj)
        const firstCard = await this.currentLessonCardsService.getFirstCard(dtoObj.userId);
        client.emit('newCard', firstCard);
    }
    @SubscribeMessage('resetProgressRequest')
    async handleResetProgressRequest(client: Socket) {
        client.emit('resetProgressRequest', {confirm: true})
    }

}