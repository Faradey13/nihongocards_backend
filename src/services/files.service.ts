import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as path from 'path'
import * as fs from 'fs'
import * as uuid from 'uuid'
@Injectable()
export class FilesService {

    async createFile(file): Promise<string>{
        let filePath
        try {

            const fileName = file[0].originalname

            if((path.extname(file[0].originalname) === '.png' || (path.extname(file[0].originalname)) === '.jpg')){
                filePath = path.resolve(__dirname, '..', 'static/image')

            } else {
                filePath = path.resolve(__dirname, '..', 'static/audio')
            }


            if(!fs.existsSync(filePath)){
                fs.mkdirSync(filePath, { recursive: true })
            }
            fs.promises.writeFile(path.join(filePath, fileName), file[0].buffer)
            return fileName
        } catch (e) {

            throw new HttpException(`Error while writing the file: ${e.message}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
