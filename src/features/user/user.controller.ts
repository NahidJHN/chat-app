import { Controller, Post, Body, Get, Query, Param } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { Public } from "../common";
import { Types } from "mongoose";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/admin/create")
  @Public()
  async createAdmin(@Body() createUserDto: CreateUserDto) {
    const admin = await this.userService.createAdmin(createUserDto);
    return { data: admin, message: "Admin created successfully" };
  }

  @Get()
  async getUsers(@Query("name") name: string) {
    const data = await this.userService.getUsers(name);
    return { data };
  }

  @Get(":userId")
  async getUsersById(@Param("userId") id: Types.ObjectId) {
    const data = await this.userService.getUserById(id);
    return data;
  }
}
