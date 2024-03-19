// import { Body, Controller, Post, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
// import { FileFieldsInterceptor } from "@nestjs/platform-express";
// import { CardsService } from "./cards.service";
// import { CreateCardDto } from "./create-card.dto";
// import { UpdateCardDto } from "../user-cards/update-card.dto";
// import { ApiOperation, ApiResponse } from "@nestjs/swagger";
// import { Card } from "./cards.model";
// import { Roles } from "../util/decorators/roles-auth.decorator";
// import { RolesGuard } from "../util/guards/role.guard";
//
// @Controller('cards')
// export class CardsController {
//
//     constructor(private cardService: CardsService) {
//     }
//     @Roles("ADMIN")
//     @UseGuards(RolesGuard)
//     @ApiOperation({summary: 'создание карты'})
//     @ApiResponse({status: 200, type: Card})
//     @Post('/create')
//     @UseInterceptors(FileFieldsInterceptor([
//         { name: 'image', maxCount: 1 },
//         { name: 'audio', maxCount: 1 },
//     ]))
//     createCard(@Body() dto: CreateCardDto,
//                @UploadedFiles() files: { image?: Express.Multer.File[], audio?: Express.Multer.File[] }) {
//                 console.log()
//             return this.cardService.createOneCard(dto, files.image, files.audio)
//     }
//     @Roles("ADMIN")
//     @UseGuards(RolesGuard)
//     @ApiOperation({summary: 'Выдать роль'})
//     @ApiResponse({status: 200})
//     @Post('/update')
//     update(@Body() dto: UpdateCardDto){
//         return this.cardService.updateCard(dto)
//     }
//
//     @Roles("ADMIN")
//     @UseGuards(RolesGuard)
//     @Post('/del')
//     del(@Body() body:{ word: string }) {
//         return this.cardService.removeCard(body.word)
//     }
// }
