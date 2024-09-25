import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('token')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  // @Post('register')
  // async register(@Body() body) {
  //   const { email, password, role } = body;
  //   return this.authService.register(email, password, role);
  // }

  @Post('token/refresh/')
  async refresh(@Body('refresh') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
