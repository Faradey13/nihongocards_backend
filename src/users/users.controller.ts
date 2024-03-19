import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    UseGuards,

} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { User } from "./users.model";
import { CreateUserDto } from "./create-user.dto";
import { Roles } from "../util/decorators/roles-auth.decorator";
import { RolesGuard } from "../util/guards/role.guard";
import { AddRoleDto } from "../roles/add-role.dto";
import { BanUserDto } from "./ban-user.dto";



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

    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @ApiOperation({summary: 'Получение всех пользователей'})
    @ApiResponse({status: 200, type: [User]})
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
            console.log(user)
            return user



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

