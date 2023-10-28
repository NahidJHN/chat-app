import {
  IsMongoId,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsEnum,
  IsOptional,
  IsString,
} from "class-validator";
import { Types } from "mongoose";

export class CreateConversationDto {
  @IsNotEmpty({ message: "participants is required" })
  @IsArray({ message: "Invalid Participant" })
  participants: Types.ObjectId[];

  @IsOptional()
  @IsString({ message: "Invalid conversation name" })
  name: string;

  @IsOptional()
  @IsMongoId({ message: "Invalid conversation" })
  creator: string;

  @IsEnum(["dual", "group"], { message: "Invalid type" })
  type: string;
}
