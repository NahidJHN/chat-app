import { Connection, Model, Types } from "mongoose";
import { Injectable } from "@nestjs/common";
import { collectionsName } from "../constant";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Message } from "./schema/message.schema";
import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";
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

      const conversation = await this.conversationService.updateConversation(
        createMessageDto.conversation,
        createMessageDto.content,
        false,
        session
      );
      await newMessage.save({ session });
      await session.commitTransaction();

      return { message: newMessage, conversation };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async findAll(conversationId: Types.ObjectId): Promise<Message[]> {
    return this.messageModel.find({ conversation: conversationId }).exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
