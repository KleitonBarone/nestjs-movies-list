import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
  ApiBody,
} from '@nestjs/swagger';
import { LoginSchema, AuthTokenSchema, RegisterSchema } from './auth.schemas';
import { getOpenApiSchema } from '../common/openapi';
import {
  UnauthorizedErrorSchema,
  BadRequestErrorSchema,
} from '../common/schemas/error.schema';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({
    description: 'Login payload',

    schema: getOpenApiSchema(LoginSchema, 'Login'),
  })
  @ApiOkResponse({
    description: 'JWT access token',

    schema: getOpenApiSchema(AuthTokenSchema, 'AuthToken'),
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',

    schema: getOpenApiSchema(UnauthorizedErrorSchema, 'UnauthorizedError'),
  })
  async login(@Body() req: { email: string; password: string }) {
    const user = await this.authService.validateUser(req.email, req.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    description: 'Signup payload',

    schema: getOpenApiSchema(RegisterSchema, 'Register'),
  })
  @ApiCreatedResponse({
    description: 'User created',

    schema: getOpenApiSchema(AuthTokenSchema, 'AuthToken'),
  })
  @ApiBadRequestResponse({
    description: 'Invalid payload',

    schema: getOpenApiSchema(BadRequestErrorSchema, 'BadRequestError'),
  })
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
}
