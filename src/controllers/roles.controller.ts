import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { RolesService } from "../services/roles.service";
import { CreateRoleDto } from "../dto/create-role.dto";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller('roles')
export class RolesController {
    constructor(private roleService: RolesService) {
    }

    @ApiOperation({summary: 'Создать роль'})
    @ApiResponse({status: 200})
    @Post()
    create(@Body() dto: CreateRoleDto) {
        return this.roleService.createRole(dto)
    }

    @ApiOperation({summary: 'Выдать роль'})
    @ApiResponse({status: 200})
    @Get('/:value')
    getByValue(@Param('value') value:string) {
        return this.roleService.getRoleByValue(value)
    }

}
