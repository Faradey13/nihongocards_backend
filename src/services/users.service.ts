import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "../models/users.model";
import { RolesService } from "./roles.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { AddRoleDto } from "../dto/add-role.dto";
import { BanUserDto } from "../dto/ban-user.dto";
import { UserCards } from "../models/user-cards.model";
import { Card } from "../models/cards.model";



@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User,
              private roleService: RolesService,
              @InjectModel(UserCards) private userCardsRepository: typeof UserCards,
              @InjectModel(Card) private cardsRepository: typeof Card) {}
  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto)

    const role = await this.roleService.getRoleByValue('USER')

    await user.$set('roles', [role.id])
    user.roles = [role]

    try {
        const cards = await this.cardsRepository.findAll()


        const userCardData = cards.map((card) => ({
            userId: user.id,
            cardId: card.id
        }));

        for (const data of userCardData) {
            const newCard = this.userCardsRepository.build(data);
            await newCard.save();
        }

    } catch (e) {
      throw new HttpException(`Ошибка добавления карт пользователю: ${e.message}`, HttpStatus.INTERNAL_SERVER_ERROR )
    }
      return user
  }

  async getAllUsers() {
      return  await  this.userRepository.findAll({include: { all:true}})
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({where: {email}, include: { all: true}})
  }

  async addRole(dto: AddRoleDto) {
    const user = await this.userRepository.findByPk(dto.userID)
    const role = await this.roleService.getRoleByValue(dto.value)
    if (role && user) {
      await user.$add('role', role.id)
      return dto
    }
    throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND)
  }

  async ban(dto: BanUserDto) {
      const user = await this.userRepository.findByPk(dto.userId)
        if (!user) {
          throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
        }
      user.banned = true
      user.banReason = dto.banReason
      await user.save()
      return user
  }
}
