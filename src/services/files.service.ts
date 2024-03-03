import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as path from 'path'
import * as fs from 'fs'

@Injectable()
export class FilesService {

    async createFile(file): Promise<any> {
        let filePath
        if (typeof file === "object") {
            const arrFromObj = file.files
            if (arrFromObj.length > 0) {
                arrFromObj.map(file => {
                    console.log(file.originalname)
                    try {
                        const fileName = file.originalname


                        if ((path.extname(file.originalname) === '.png' || path.extname(file.originalname)) === '.jpg' || path.extname(file.originalname) === '.gif') {
                            filePath = path.resolve(__dirname, '..', 'static/image')

                        } else {
                            filePath = path.resolve(__dirname, '..', 'static/audio')
                        }


                        if (!fs.existsSync(filePath)) {
                            fs.mkdirSync(filePath, { recursive: true })
                        }
                        fs.promises.writeFile(path.join(filePath, fileName), file.buffer)
                        return fileName
                    } catch (e) {

                        throw new HttpException(`Error while writing the file: ${e.message}`, HttpStatus.INTERNAL_SERVER_ERROR)
                    }

                })
            }
        } else {
            try {
                const fileName = file[0].originalname


                if ((path.extname(file[0].originalname) === '.png' || path.extname(file[0].originalname)) === '.jpg' || path.extname(file[0].originalname) === '.gif') {
                    filePath = path.resolve(__dirname, '..', 'static/image')

                } else {
                    filePath = path.resolve(__dirname, '..', 'static/audio')
                }


                if (!fs.existsSync(filePath)) {
                    fs.mkdirSync(filePath, { recursive: true })
                }
                fs.promises.writeFile(path.join(filePath, fileName), file[0].buffer)
                return fileName
            } catch (e) {

                throw new HttpException(`Error while writing the file: ${e.message}`, HttpStatus.INTERNAL_SERVER_ERROR)
            }
        }
    }
}