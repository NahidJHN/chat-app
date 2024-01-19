import { Connection, Model, Types } from "mongoose";
import { Injectable } from "@nestjs/common";
import { collectionsName } from "../constant";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Message } from "./schema/message.schema";
import { CreateMessageDto } from "./dto/create-message.dto";
import { Conversation } from "../conversation/schema/conversation.schema";
import { ConversationService } from "../conversation/conversation.service";

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(collectionsName.Message)
    private readonly messageModel: Model<Message>,
    @InjectModel(collectionsName.Conversation)
    private readonly conversationModel: Model<Conversation>,
    @InjectConnection() private readonly connection: Connection,
    private readonly conversationService: ConversationService
  ) {}

  async create(
    createMessageDto: CreateMessageDto
  ): Promise<{ message: Message; conversation: Conversation }> {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      const newMessage = new this.messageModel(createMessageDto);
      await newMessage.save({ session });

      const conversation = await this.conversationService.updateConversation(
        createMessageDto.sender,
        createMessageDto.conversation,
        newMessage._id,
        session
      );

      await session.commitTransaction();

      return { message: newMessage, conversation };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async findAll(
    conversationId: Types.ObjectId,
    page: string
  ): Promise<Message[]> {
    const pageCount = Number(page || 0) - 1;

    return this.messageModel
      .find({ conversation: conversationId })
      .limit(10)
      .skip(pageCount * 10)
      .sort({ createdAt: -1 })
      .exec();
  }
}
