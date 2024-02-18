import { Injectable } from "@nestjs/common";

import { Card } from "../models/cards.model";
import * as csvParser from 'csv-parser';
import * as fs from "fs";
import { InjectModel } from "@nestjs/sequelize";


@Injectable()
export class CsvService {
    constructor(
      @InjectModel(Card)
      private cardRepository: typeof Card
    ) {}

    async loadCsvData(filePath: string): Promise<void> {
        const records: Card[] = [];

        fs.createReadStream(filePath)
          .pipe(csvParser())
          .on('data', (data) => {
              records.push(this.createCardFromRecord(data));
          })
          .on('end', async () => {
              try {
                  await this.cardRepository.bulkCreate(records);
              } catch (e) {
                  console.log(e.message)
              }
          })
          .on('error', (error) => {
              throw error;
          });
    }

    private createCardFromRecord(record: any): any {
        console.log('Record being processed:', record, { ignoreDuplicates: true });

            return {
            word : record.word,
            translation : record.translation,
            example : record.example,
            category : record.category,
            difficulty : parseInt(record.difficulty, 10),
            image : record.image,
            audio : record.audio,
        }

    }

}
