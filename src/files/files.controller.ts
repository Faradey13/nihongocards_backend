import {
    Controller,
    HttpException,
    HttpStatus,
    Post,
    UploadedFiles, UseGuards,
    UseInterceptors
} from "@nestjs/common";
import { FilesService } from "./files.service";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Roles } from "../util/decorators/roles-auth.decorator";
import { RolesGuard } from "../util/guards/role.guard";


@Controller("files")
export class FilesController {
    constructor(private filesService: FilesService) {
    }


    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @ApiOperation({summary: 'Загружка файлов(изображения и аудио)'})
    @ApiResponse({status: 200})
    @Post('upload')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'files', maxCount: 1000 },
    ]))
    async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
        try {
            console.log(files);
            return await this.filesService.createFile(files)

        } catch (e) {
            console.log(e)
            throw new HttpException('Ошибка при загрузке файлов', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}