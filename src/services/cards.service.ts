import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import { Card } from "../models/cards.model";
import { FilesService } from "./files.service";
import { CreateCardDto } from "../dto/create-card.dto";
import { UpdateCardDto } from "../dto/update-card.dto";


@Injectable()
export class CardsService {

    constructor(@InjectModel(Card) private cardRepository: typeof Card,
                private fileService: FilesService) {}
    async createOneCard(dto: CreateCardDto, image: any, audio: any) {
        const fileNameImage = await this.fileService.createFile(image)
        const fileNameAudio = await this.fileService.createFile(audio)
        return await this.cardRepository.create({...dto, image: fileNameImage, audio: fileNameAudio})
    }

    async updateCard(dto:UpdateCardDto) {
        const updateFields = Object.fromEntries(Object.entries(dto).
        filter(([key, field]) => field !== undefined))

        await this.cardRepository.update(updateFields,
          {where:{
            word: dto.word
            }})
    }

    async removeCard(word: string) {
        await this.cardRepository.destroy({where:{
            word: word
            }})
    }


}
