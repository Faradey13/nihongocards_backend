import {
    Controller,
    HttpException,
    HttpStatus,
    Post,
    UploadedFile,
    UploadedFiles,
    UseInterceptors
} from "@nestjs/common";
import { FilesService } from "../services/files.service";
import { FileFieldsInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";


@Controller("files")
export class FilesController {
    constructor(private filesService: FilesService) {
    }


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