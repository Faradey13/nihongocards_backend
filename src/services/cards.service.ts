import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import { Card } from "../models/cards.model";
import { FilesService } from "./files.service";
import { CreateCardDto } from "../dto/create-card.dto";
import { UpdateCardDto } from "../dto/update-card.dto";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";


@Injectable()
export class CardsService {

    constructor(@InjectModel(Card) private cardRepository: typeof Card,
                private fileService: FilesService) {}
    async createOneCard(dto: CreateCardDto, image: any, audio: any) {
        const fileNameImage = await this.fileService.createFile(image)
        const fileNameAudio = await this.fileService.createFile(audio)
        console.log(fileNameAudio)
        return await this.cardRepository.create({...dto, image: fileNameImage, audio: fileNameAudio})
    }

    @ApiOperation({summary: 'обновить данные карточки'})
    @ApiResponse({status: 200, type: Card})
    async updateCard(dto:UpdateCardDto) {
        const updateFields = Object.fromEntries(Object.entries(dto).
        filter(([key, field]) => field !== undefined))

        await this.cardRepository.update(updateFields,
          {where:{
            word: dto.word
            }})
    }
    @ApiOperation({summary: 'удаление карточки'})
    @ApiResponse({status: 200})
    async removeCard(word: string) {
        await this.cardRepository.destroy({where:{
            word: word
            }})
    }


}
