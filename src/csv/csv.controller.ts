import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { CsvService } from "./csv.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Roles } from "../util/decorators/roles-auth.decorator";
import { RolesGuard } from "../util/guards/role.guard";

@Controller('csv')
export class CsvController {
    constructor(private readonly csvService: CsvService) {
    }

    @ApiOperation({summary: 'Загрузка таблицы CSV в БД'})
    @ApiResponse({status: 200})
    @Post('/upload_table')
    @UseInterceptors(FileInterceptor('csv'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        await this.csvService.loadCsvData(file.path);
        return { message: 'CSV uploaded and processed successfully' }
    }
}
