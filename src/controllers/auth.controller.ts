import {
    ArgumentMetadata,
    Body,
    Controller,
    Get, HttpException, HttpStatus,
    Param, ParseUUIDPipe,
    PipeTransform,
    Post, Req,

    Res,
    UsePipes
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "../dto/create-user.dto";
import { Response, Request } from "express";
import { AuthService } from "../services/auth.service";
import { User } from "../models/users.model";
import * as uuid from "uuid";




@ApiTags("Авторизация")
@Controller("auth")
export class AuthController {

    constructor(private authService: AuthService
    ) {
    }

    @ApiOperation({summary: 'вход на сайт'})
    @ApiResponse({status: 200})
    @Post("/login")
    async login(@Body() userDto: CreateUserDto, @Res() res: Response) {
        try {
            const UserData = await this.authService.login(userDto);
            res.cookie("refreshToken", UserData.refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
            return res.json(UserData);
        }
        catch (e){
            `ошибка авторизации ${e.message}`
        }
    }

    @ApiOperation({summary: 'регистрация пользователя'})
    @ApiResponse({status: 200})
    @Post("/registration")
    async registration(@Body() userDto: CreateUserDto, @Res() res: Response) {
        try {
            const UserData = await this.authService.registration(userDto);
            res.cookie("refreshToken", UserData.refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
            return res.json(UserData);
        } catch (e) {

        }
    }
    @ApiOperation({summary: 'активация акаунта'})
    @ApiResponse({status: 200, type: uuid.v4()})
    @Get("/activation/:link")

    async activation( @Res() res: Response,@Param('link', ParseUUIDPipe) link: string) {

        try {
            await this.authService.activate(link)
            res.redirect('https://i.gifer.com/6Kn6.gif')
        }catch (e) {

        }
    }

    @ApiOperation({summary: 'выход и акаунта'})
    @ApiResponse({status: 200})
    @Post('/logout')
    async logout(@Req() req: Request, @Res() res: Response) {
        try {

            const  refreshToken    = req.cookies['refreshToken']
            const token = await this.authService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch (e) {
            throw  new HttpException(`Ошибка логаута ${e.message}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @ApiOperation({summary: 'перезапись access токена'})
    @ApiResponse({status: 200})
    @Get('/refresh')
    async refresh(@Req() req: Request, @Res() res: Response){
        const  refreshToken    = req.cookies['refreshToken']
        const UserData = await this.authService.refresh(refreshToken);
        res.cookie("refreshToken", UserData.refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
        return res.json(UserData);
    }

}