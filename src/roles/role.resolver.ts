import { Role } from "./roles.model";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { RolesService } from "./roles.service";
import { CreateRoleDto } from "./create-role.dto";
import { UseGuards } from "@nestjs/common";
import { Roles } from "../util/decorators/roles-auth.decorator";
import { RolesGuard } from "../util/guards/role.guard";


@Resolver( 'Role')
export class RoleResolver {
    constructor(
      private roleService: RolesService
    ) {
    }


    @Mutation(() => Role)
    async createRole(@Args('input') input: CreateRoleDto): Promise<Role> {
        console.log(input)
        return this.roleService.createRole(input);
    }

    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Query(() => Role)
    async geRoleByValue(@Args('value') value: string) : Promise<Role> {
        return this.roleService.getRoleByValue(value)
    }
}

