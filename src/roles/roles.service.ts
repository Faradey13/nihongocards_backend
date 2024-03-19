import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from "./create-role.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class RolesService {

  constructor(
    private prisma: PrismaService
  ) {
  }
  async createRole(dto:CreateRoleDto) {
    return   this.prisma.roles.create({data: dto})


  }
  async getRoleByValue(value: string) {
    return  this.prisma.roles.findFirst({where: {value}})

  }
}
