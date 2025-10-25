import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common/decorators';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiProperty,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Roles } from './roles.decorator';
import { UserRole } from '../entities/user.entity';
import { Public } from './public.decorator';
import { UnauthorizedException } from '@nestjs/common/exceptions';

class LoginDto {
  @ApiProperty({ example: 'admin@bizinsight360.com' })
  email: string;

  @ApiProperty({ example: 'password123' })
  password: string;
}

class RefreshDto {
  @ApiProperty({ example: 'your-refresh-token' })
  refresh_token: string;
}

class RegisterDto {
  @ApiProperty({ example: 'user@bizinsight360.com' })
  email: string;

  @ApiProperty({ example: 'password123' })
  password: string;
}

class ForgotPasswordDto {
  @ApiProperty({ example: 'admin@bizinsight360.com' })
  email: string;
}

class ResetPasswordDto {
  @ApiProperty({ example: 'reset-token' })
  token: string;

  @ApiProperty({ example: 'newpassword123' })
  newPassword: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 201,
    description: 'Returns access and refresh tokens',
  })
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshDto })
  @ApiResponse({
    status: 201,
    description: 'Returns new access and refresh tokens',
  })
  async refresh(@Body() body: RefreshDto) {
    return this.authService.refresh(body.refresh_token);
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 201, description: 'Logged out successfully' })
  async logout(@Request() req) {
    await this.authService.invalidateRefreshToken(req.user.id);
    return { message: 'Logged out successfully' };
  }

  @Roles(UserRole.ADMIN)
  @Post('register')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register new user (admin only)' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User created' })
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body.email, body.password);
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 201, description: 'Reset token sent' })
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    await this.authService.forgotPassword(body.email);
    return { message: 'Password reset token sent' };
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 201, description: 'Password reset successfully' })
  async resetPassword(@Body() body: ResetPasswordDto) {
    await this.authService.resetPassword(body.token, body.newPassword);
    return { message: 'Password reset successfully' };
  }

  @Public()
  @Post('resend-token')
  @ApiOperation({ summary: 'Resend password reset token' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 201, description: 'Reset token resent' })
  async resendToken(@Body() body: ForgotPasswordDto) {
    await this.authService.resendToken(body.email);
    return { message: 'Reset token resent' };
  }
}

// import {
//   Controller,
//   Post,
//   Body,
//   Request,
//   UseGuards,
//   HttpCode,
// } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { LocalAuthGuard } from './local-auth.guard';
// import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

// @ApiTags('auth')
// @Controller('auth')
// export class AuthController {
//   constructor(private authService: AuthService) {}

//   @UseGuards(LocalAuthGuard)
//   @Post('login')
//   @HttpCode(200)
//   async login(@Request() req) {
//     return this.authService.login(req.user);
//   }

//   @Post('refresh')
//   async refresh(@Body() body: { refresh_token: string }) {
//     return this.authService.refresh(body.refresh_token);
//   }

//   @Post('logout')
//   @ApiBearerAuth()
//   async logout(@Request() req) {
//     await this.authService.invalidateRefreshToken(req.user.id);
//     return { message: 'Logged out successfully' };
//   }

//   @Post('register')
//   async register(@Body() body: { email: string; password: string }) {
//     return this.authService.register(body.email, body.password);
//   }

//   @Post('forgot-password')
//   async forgotPassword(@Body() body: { email: string }) {
//     await this.authService.forgotPassword(body.email);
//     return { message: 'Password reset token sent' };
//   }

//   @Post('reset-password')
//   async resetPassword(@Body() body: { token: string; newPassword: string }) {
//     await this.authService.resetPassword(body.token, body.newPassword);
//     return { message: 'Password reset successfully' };
//   }

//   @Post('resend-token')
//   async resendToken(@Body() body: { email: string }) {
//     await this.authService.resendToken(body.email);
//     return { message: 'Reset token resent' };
//   }
// }
