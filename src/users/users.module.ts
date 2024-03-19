import { forwardRef, Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { AuthModule } from "../auth/auth.module";
import { RolesModule } from "../roles/roles.module";
import { JwtModule } from "@nestjs/jwt";
import { UsersResolver } from "./users.resolver";
import { PrismaService } from "../prisma/prisma.service";
import { UserCardsModule } from "../user-cards/user-cards.module";




@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersResolver, PrismaService],
  imports: [
    JwtModule.register({}),
    // SequelizeModule.forFeature([User, Card, Role, UserCards, UserRoles]),
    forwardRef(()=> AuthModule),
    RolesModule,
    UserCardsModule


  ],
  exports: [
    UsersService,
    JwtModule

  ]
})
export class UsersModule {}
