import { Controller, Post, UploadedFile } from "@nestjs/common";
import { CardsService } from "./cards.service";
import { CreateCardDto } from "./dto/create-card.dto";

@Controller('cards')
export class CardsController {

    constructor(private cardService: CardsService) {
    }

    @Post()
    createCard(dto: CreateCardDto,
               @UploadedFile() image, audio) {
            this.cardService.create(dto, image, audio)
    }
}
