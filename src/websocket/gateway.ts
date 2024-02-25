import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { CurrentLessonCardsService } from "../services/currentLessonCards.service";
import { GetCardDto } from "../dto/getCard.dto";


@WebSocketGateway(5001)
export class AppGateway  {
    @WebSocketServer() server: Server

    private activeUserConnection: Map<string,string> = new Map<string, string>()

    constructor(private readonly currentLessonCardsService: CurrentLessonCardsService ) {
    }
    handleConnection(client: Socket, ...args: any[]){
        const userIdHeaderValue = client.handshake.headers['user-id'];
        const userID = typeof userIdHeaderValue === 'string' ? userIdHeaderValue : userIdHeaderValue[0];
        console.log(`Пользователь ${userID} подключился`);
        this.activeUserConnection.set(userID, client.id);
        //   args[0].userId
        // if( this.activeUserConnection.has(userID)){
        //     this.activeUserConnection.set(userID, client.id)
        // } else {
        //     client.emit('ошибка подключения, возможно пользователь уже подключен')
        //     client.disconnect()
        // }
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
        console.log(dtoObj)
        await this.currentLessonCardsService.updateCard(dtoObj)

        const newCard = await this.currentLessonCardsService.getFirstCard()

        client.emit('newCard', newCard)
    }

    @SubscribeMessage('startLearning')
    async handleStartLearning(client: Socket, dto: GetCardDto) {
        console.log('Пользователь начал обучение');
        // await this.currentLessonCardsService.startNewLesson(dto)
        const firstCard = await this.currentLessonCardsService.getFirstCard();
        client.emit('newCard', firstCard);
    }
}