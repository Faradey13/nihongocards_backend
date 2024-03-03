import { Body, Controller, Post, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "../services/auth.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { Response } from 'express';


@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService
              ) {
  }
  @Post('/Login')
  login(@Body() userDto: CreateUserDto){
    return this.authService.login(userDto)
  }

  @Post('/registration')
  async registration(@Body() userDto: CreateUserDto, @Res() res: Response){
    try {
      const UserData = await this.authService.registration(userDto)
      res.cookie('refreshToken', UserData.refreshToken, {httpOnly: true, maxAge: 30*24*60*60*1000})
      return res.json(UserData)
    } catch (e) {
      console.log(e)
    }

  }
}
