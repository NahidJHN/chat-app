import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { collectionsName } from "../constant";
import { UserSchema } from "./schema/user.schema";
import { ConversationSchema } from "../conversation/schema/conversation.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: collectionsName.user, schema: UserSchema },
      { name: collectionsName.Conversation, schema: ConversationSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
