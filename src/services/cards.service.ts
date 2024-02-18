import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import { Card } from "../models/cards.model";
import { FilesService } from "./files.service";
import { CreateCardDto } from "../dto/create-card.dto";


@Injectable()
export class CardsService {

    constructor(@InjectModel(Card) private cardRepository: typeof Card,
                private fileService: FilesService) {}
    async createOneCard(dto: CreateCardDto, image: any, audio: any) {
        const fileNameImage = await this.fileService.createFile(image)
        const fileNameAudio = await this.fileService.createFile(audio)
        const card = await this.cardRepository.create({...dto, image: fileNameImage, audio: fileNameAudio})
        return card
    }
}
