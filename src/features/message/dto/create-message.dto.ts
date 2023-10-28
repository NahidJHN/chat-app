import { IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateMessageDto {
  @IsNotEmpty({ message: "conversationId is required" })
  @IsMongoId({ message: "Invalid Conversation Id" })
  conversation: Types.ObjectId;

  @IsNotEmpty({ message: "senderId is required" })
  @IsMongoId({ message: "Invalid Sender Id" })
  sender: Types.ObjectId;

  @IsNotEmpty({ message: "content is required" })
  @IsString({ message: "Invalid Content" })
  content: string;
}
