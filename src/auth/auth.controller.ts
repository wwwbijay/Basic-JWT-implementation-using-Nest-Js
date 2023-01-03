import { Body, Controller, Delete, Ip, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import RefreshTokenDto from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  // we need to create the LoginDto.
  async login(@Req() request, @Ip() ip: string, @Body() body: LoginDto) {
      // geting the useragent and ip address from @Req decorator and @Ip decorater imported at the top.
    return this.authService.login(body.email, body.password, {
      ipAddress: ip,
      userAgent: request.headers['user-agent']
    });
  }

  @Post('refresh')
  // we need to create RefreshTokenDto
  async refreshToken(@Body() body: RefreshTokenDto) {
    return this.authService.refresh(body.refreshToken);
  }

  @Delete('logout')
  // we need to create RefreshTokenDto
  async logout(@Body() body: RefreshTokenDto) {
    return this.authService.logout(body.refreshToken);
  }
}
