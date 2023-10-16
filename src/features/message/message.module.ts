import { Module } from "@nestjs/common";
import { MessageService } from "./message.service";
import { MessageController } from "./message.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { collectionsName } from "../constant";
import { MessageSchema } from "./schema/message.schema";
import { ConversationSchema } from "../conversation/schema/conversation.schema";
import { ConversationModule } from "../conversation/conversation.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: collectionsName.Message, schema: MessageSchema },
      { name: collectionsName.Conversation, schema: ConversationSchema },
    ]),
    ConversationModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
