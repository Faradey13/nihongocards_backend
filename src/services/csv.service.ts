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
              console.log('Data from CSV:', data);
              records.push(this.createPostFromRecord(data));
          })
          .on('end', async () => {
              console.log('Records:', records);
              console.log('Starting bulk create operation...');
              await this.cardRepository.bulkCreate(records);
              console.log('CSV file has been processed successfully.');
          })
          .on('error', (error) => {
              console.log('Bulk create operation completed.');
              console.error('Error processing CSV file:', error);
              throw error;
          });
    }

    private createPostFromRecord(record: any): any {
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
