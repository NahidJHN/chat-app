import { Types } from "mongoose";

export class CreateChatDto {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  content: string;
  conversationId: Types.ObjectId;
  socketId: string;
}
