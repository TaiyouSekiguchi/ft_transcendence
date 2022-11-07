import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  // Res,
  // Req,
} from '@nestjs/common';
import { User } from '@prisma/client';
// import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/createUserDto.dto';
import { CredentialsDto } from './dto/credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() dto: CreateUserDto): Promise<User> {
    return await this.authService.signUp(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: CredentialsDto): Promise<{ accessToken: string }> {
    return await this.authService.login(dto);
  }

  // @HttpCode(HttpStatus.OK)
  // @Post('login')
  // async login(
  //   @Body() dto: AuthDto,
  //   @Res({ passthrough: true }) res: Response
  // ): Promise<Msg> {
  //   const jwt = await this.authService.login(dto);
  //   res.cookie('access_token', jwt.accessToken, {
  //     httpOnly: true,
  //     secure: true,
  //     sameSite: 'none',
  //     path: '/',
  //   });

  //   return {
  //     message: 'ok',
  //   };
  // }

  // @HttpCode(HttpStatus.OK)
  // @Post('/logout')
  // logout(
  //   @Req() req: Request,
  //   @Res({ passthrough: true }) res: Response
  // ): { message: string } {
  //   res.cookie('access_token', '', {
  //     httpOnly: true,
  //     secure: false,
  //     sameSite: 'none',
  //     path: '/',
  //   });

  //   return { message: 'ok' };
  // }
}
