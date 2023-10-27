import { Types } from "mongoose";

export class CreateChatDto {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  content: string;
  conversation: Types.ObjectId;
}
