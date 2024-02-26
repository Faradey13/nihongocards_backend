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


@Controller("files")
export class FilesController {
    constructor(private filesService: FilesService) {
    }

    @Post('upload')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'files', maxCount: 1000 },
    ]))
    async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
        try {
            await this.filesService.createFile(files)
            console.log('файлы успешно добавлены');
        } catch (e) {
            console.log(e)
            throw new HttpException('Ошибка при загрузке файлов', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}