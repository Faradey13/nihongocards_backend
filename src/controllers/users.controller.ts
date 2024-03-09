import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Req,
    Res,
    UseGuards,
    UsePipes
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UsersService } from "../services/users.service";
import { User } from "../models/users.model";
import { CreateUserDto } from "../dto/create-user.dto";
import { Roles } from "../util/decorators/roles-auth.decorator";
import { RolesGuard } from "../util/guards/role.guard";
import { AddRoleDto } from "../dto/add-role.dto";
import { BanUserDto } from "../dto/ban-user.dto";



@ApiTags('Пользователи')
@Controller('users')
export class UsersController {


    constructor(private usersService: UsersService) {}

    @ApiOperation({summary: 'создание пользователя'})
    @ApiResponse({status: 200, type: User})
    @Post()
    create(@Body() userDto: CreateUserDto){
        return this.usersService.createUser(userDto)
    }

    @ApiOperation({summary: 'Получение всех пользователей'})
    @ApiResponse({status: 200, type: [User]})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Get()
    getAll() {

        return this.usersService.getAllUsers()
    }

    @ApiOperation({summary: 'Получение пользователя по id и отправка его данных на клиент'})
    @ApiResponse({status: 200, type: [User]})
    @Get(`/:id`)
    async getUser( @Param('id') id: number) {
        try {
            const user =    await this.usersService.geUserById(id);
            console.log(user.dataValues)
            return user.dataValues



        } catch (error) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
    }



    @ApiOperation({summary: 'Выдать роль'})
    @ApiResponse({status: 200})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Post('/role')
    addRole(@Body() dto: AddRoleDto){
          return this.usersService.addRole(dto)
        }

    @ApiOperation({summary: 'Заблокировать пользователя'})
    @ApiResponse({status: 200})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Post('/ban')
    ban(@Body() dto: BanUserDto){
        return this.usersService.ban(dto)
    }




}

