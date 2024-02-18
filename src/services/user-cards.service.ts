import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { Card } from "../models/cards.model";
import { UserCardsDto } from "../dto/user-cards.dto";

@Injectable()
export class UserCardsService {
    constructor(
      @InjectRepository(Card)
      private readonly cardsRepository: Repository<Card>,


    ) {}

    async getCardsByParams(dto: UserCardsDto): Promise<Card[]> {
        return this.cardsRepository
          .createQueryBuilder('cards')
          .leftJoin('users-cards', 'uc', 'cards.id = uc.cardId')
          .where('uc.userId = :userId', { userId:dto.userID })
          .andWhere('users-cards.levelOfKnowledge = :level', { level:dto.level })
          .limit(dto.limit)
          .getMany();
    }

    async getCardsByCategory(dto: UserCardsDto): Promise<Card[]> {
        return this.cardsRepository
          .createQueryBuilder('cards')
          .leftJoin('users-cards', 'uc', 'cards.id = uc.cardId')
          .where('uc.userId = :userId', { userId:dto.userID })
          .andWhere('users-cards.levelOfKnowledge = :level', { level:dto.level })
          .andWhere('cards.category = :category', { category:dto.category })
          .limit(dto.limit)
          .getMany();
    }
}
