import { Injectable } from "@nestjs/common";
import { CreateChatDto } from "./dto/create-chat.dto";
import { UpdateChatDto } from "./dto/update-chat.dto";
import { InjectModel } from "@nestjs/mongoose";
import { MessageService } from "../message/message.service";
import { Message } from "../message/schema/message.schema";
import { Conversation } from "../conversation/schema/conversation.schema";
import { ConversationService } from "../conversation/conversation.service";
import { Types } from "mongoose";

@Injectable()
export class ChatService {
  constructor(
    private readonly messageService: MessageService,
    private readonly conversationService: ConversationService
  ) {}

  async create(
    createChatDto: CreateChatDto
  ): Promise<{ message: Message; conversation: Conversation }> {
    const data = await this.messageService.create(createChatDto);
    return data;
  }

  async updateConversation(
    conversationId: Types.ObjectId
  ): Promise<Conversation> {
    const conversation = this.conversationService.updateIsRead(
      conversationId,
      true
    );
    return conversation;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
