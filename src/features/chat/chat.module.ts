import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatGateway } from "./chat.gateway";
import { UserModule } from "../user/user.module";
import { MessageModule } from "../message/message.module";

@Module({
  imports: [UserModule, MessageModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
