import { Injectable } from '@nestjs/common';
import { Card } from "./cards.model";
import { FilesService } from "../files/files.service";
import { CreateCardDto } from "./create-card.dto";
import { UpdateCardDto } from "../user-cards/update-card.dto";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";


@Injectable()
export class CardsService {

    constructor(
                private fileService: FilesService,
                private prisma: PrismaService
                ) {}
    async createOneCard(dto: CreateCardDto, image: string, audio: string) {
        const fileNameImage: string = await this.fileService.createFile(image)
        const fileNameAudio:string = await this.fileService.createFile(audio)
        const cardData: Prisma.cardsCreateInput = {
            ...dto,
            image: fileNameImage,
            audio: fileNameAudio
        };
        return  this.prisma.cards.create({data: cardData})
    }

    @ApiOperation({summary: 'обновить данные карточки'})
    @ApiResponse({status: 200, type: Card})
    async updateCard(dto:UpdateCardDto) {
        const updateFields = Object.fromEntries(Object.entries(dto).
        filter(([ field]) => field !== undefined))
        const card = await this.prisma.cards.findUnique({where: {word: dto.word}})

        await this.prisma.cards.update(
          {where:{
            id: card.id
            }, data: updateFields})
    }
    @ApiOperation({summary: 'удаление карточки'})
    @ApiResponse({status: 200})
    async removeCard(word: string) {
        await this.prisma.cards.delete({where:{
            word: word
            }})
    }


}
