import { Body, Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { CardsService } from "../services/cards.service";
import { CreateCardDto } from "../dto/create-card.dto";

@Controller('cards')
export class CardsController {

    constructor(private cardService: CardsService) {
    }

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'image', maxCount: 1 },
        { name: 'audio', maxCount: 1 },
    ]))
    createCard(@Body() dto: CreateCardDto,
               @UploadedFiles() files: { image?: Express.Multer.File[], audio?: Express.Multer.File[] }) {

            return this.cardService.createOneCard(dto, files.image, files.audio)
    }
}
