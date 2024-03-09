import { Injectable } from "@nestjs/common";

import { Card } from "../models/cards.model";
import * as csvParser from 'csv-parser';
import * as fs from "fs";
import { InjectModel } from "@nestjs/sequelize";
import { UserCardsService } from "./user-cards.service";


@Injectable()
export class CsvService {
    constructor(
      @InjectModel(Card) private cardRepository: typeof Card,
      private userCardsService: UserCardsService
    ) {}

    async loadCsvData(filePath: string): Promise<void> {
        console.log(filePath)
        const records: Card[] = [];

        fs.createReadStream(filePath)
          .pipe(csvParser({ separator: ';' }))
          .on('data', (data) => {

            const sanitizedData = {};
            for (const key in data) {
                sanitizedData[key.replace(/^\ufeff/, '')] = data[key];
            }
            records.push(this.createCardFromRecord(sanitizedData));
        })

          .on('end', async () => {

              try {
                  await this.cardRepository.bulkCreate(records);
                  await this.userCardsService.addCardsToUsers()
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
            difficulty : Number(record.difficulty),
            image : record.image,
            audio : record.audio,
            isFront: record.isFront
        }

    }

}
