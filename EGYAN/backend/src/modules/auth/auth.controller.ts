import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ForgotPasswordDto } from '../user/dto/ForgotPasswordDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('login')
  async login(
    @Body() loginDTO: CreateUserDto,
    @Res() res: Response,
  ) {
    return this.authService.login(loginDTO.email, loginDTO.password, res);
  }
@UseGuards(JwtAuthGuard)
@Get('me')
getMe(@Req() req: Request) {
  const user = req.user!;
  return this.authService.getProfile(user['id']);
}

  @Post('logout')
  async logout(@Res() res: Response): Promise<void> {
    return this.authService.logout(res);
  }
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }
}
