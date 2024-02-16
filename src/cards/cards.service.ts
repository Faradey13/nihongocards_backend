import { Injectable } from '@nestjs/common';
import { CreateCardDto } from "./dto/create-card.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Card } from "./cards.model";

@Injectable()
export class CardsService {

    constructor(@InjectModel(Card) private cardRepository: typeof Card) {
    }
    async create(dto: CreateCardDto, image: any, audio: any) {
        const fileNameImage = 'dsf'
        const fileNameAudio = 'dsf1'
        const card = await this.cardRepository.create({...dto, image: fileNameImage, audio: fileNameAudio})
        return card
    }
}
