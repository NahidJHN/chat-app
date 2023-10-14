import { Module } from "@nestjs/common";
import { MessageService } from "./message.service";
import { MessageController } from "./message.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { collectionsName } from "../constant";
import { MessageSchema } from "./schema/message.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: collectionsName.Message, schema: MessageSchema },
    ]),
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
