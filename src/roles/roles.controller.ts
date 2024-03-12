import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { CreateRoleDto } from "./create-role.dto";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Roles } from "../util/decorators/roles-auth.decorator";
import { RolesGuard } from "../util/guards/role.guard";

@Controller('roles')
export class RolesController {
    constructor(private roleService: RolesService) {
    }

    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @ApiOperation({summary: 'Создать роль'})
    @ApiResponse({status: 200})
    @Post()
    create(@Body() dto: CreateRoleDto) {
        return this.roleService.createRole(dto)
    }

    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @ApiOperation({summary: 'Выдать роль'})
    @ApiResponse({status: 200})
    @Get('/:value')
    getByValue(@Param('value') value:string) {
        return this.roleService.getRoleByValue(value)
    }

}
