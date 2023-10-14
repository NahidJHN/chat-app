import { Module } from "@nestjs/common";
import { ConversationService } from "./conversation.service";
import { ConversationController } from "./conversation.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { ConversationSchema } from "./schema/conversation.schema";
import { collectionsName } from "../constant";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: collectionsName.Conversation, schema: ConversationSchema },
    ]),
  ],
  controllers: [ConversationController],
  providers: [ConversationService],
})
export class ConversationModule {}
