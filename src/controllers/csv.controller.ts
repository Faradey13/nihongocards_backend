import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { CsvService } from "../services/csv.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('csv')
export class CsvController {
    constructor(private readonly csvService: CsvService) {
    }

    @Post('/upload_table')
    @UseInterceptors(FileInterceptor('csv'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        await this.csvService.loadCsvData(file.path);
        return { message: 'CSV uploaded and processed successfully' }
    }
}
