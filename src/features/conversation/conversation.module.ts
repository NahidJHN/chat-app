import { Module } from "@nestjs/common";
import { ConversationService } from "./conversation.service";
import { ConversationController } from "./conversation.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { ConversationSchema } from "./schema/conversation.schema";
import { collectionsName } from "../constant";
import { GroupConversationSchema } from "./schema/group-conversation.schema";
import { PrivateConversationSchema } from "./schema/private-conversation.schema";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: collectionsName.Conversation, schema: ConversationSchema },
      {
        name: collectionsName.GroupConversation,
        schema: GroupConversationSchema,
      },
      {
        name: collectionsName.PrivateConversation,
        schema: PrivateConversationSchema,
      },
    ]),
    // UserModule,
  ],
  controllers: [ConversationController],
  providers: [ConversationService],
  exports: [ConversationService],
})
export class ConversationModule {}
