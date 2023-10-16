import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatGateway } from "./chat.gateway";
import { UserModule } from "../user/user.module";
import { MessageModule } from "../message/message.module";
import { ConversationModule } from "../conversation/conversation.module";

@Module({
  imports: [UserModule, MessageModule, ConversationModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
