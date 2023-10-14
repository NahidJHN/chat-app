import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { Public } from "../common";
import { RegisterDto } from "./dto/register.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("/login")
  @Public()
  async login(@Body() loginDto: LoginDto) {
    const res = await this.authService.logIn(loginDto);
    return { data: res, message: "Login success" };
  }

  @Post("/signup")
  @Public()
  async register(@Body() registerDto: RegisterDto) {
    const res = await this.authService.register(registerDto);
    return { data: res, message: "Registration Successful" };
  }
}
