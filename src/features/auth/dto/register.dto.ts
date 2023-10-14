import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RegisterDto {
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: "Name is required" })
  @IsString()
  name: string;

  @IsNotEmpty({ message: "Password is required" })
  @IsString()
  password: string;
}
