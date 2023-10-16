import { Injectable } from "@nestjs/common";
import { CreateConversationDto } from "./dto/create-conversation.dto";
import { InjectModel } from "@nestjs/mongoose";
import { collectionsName } from "../constant";
import { Conversation } from "./schema/conversation.schema";
import { ClientSession, Model, Types } from "mongoose";
import { UpdateConversationDto } from "./dto/update-conversation.dto";

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(collectionsName.Conversation)
    private readonly conversationModel: Model<Conversation>
  ) {}

  create(createConversationDto: CreateConversationDto): Promise<Conversation> {
    const conversation = new this.conversationModel(createConversationDto);
    return conversation.save();
  }

  async findAll(userId: Types.ObjectId): Promise<Conversation[]> {
    return this.conversationModel
      .find({
        $or: [{ creator: userId }, { participant: userId }],
      })
      .populate({
        path: "creator",
        select: "name email avatar",
      })
      .populate({
        path: "participant",
        select: "name email avatar",
      })
      .exec();
  }

  async updateConversation(
    conversationId: Types.ObjectId,
    content: string,
    isRead: boolean,
    session: ClientSession
  ): Promise<Conversation> {
    const conversation = await this.conversationModel
      .findByIdAndUpdate(
        conversationId,
        {
          lastMessage: content,
          lastUpdate: new Date(),
          isRead,
        },
        { session, new: true }
      )
      .populate({
        path: "creator",
        select: "name email avatar",
      })
      .populate({
        path: "participant",
        select: "name email avatar",
      });
    return conversation;
  }
  async updateIsRead(
    conversationId: Types.ObjectId,
    isRead: boolean
  ): Promise<Conversation> {
    const conversation = this.conversationModel
      .findByIdAndUpdate(
        conversationId,
        {
          isRead,
        },
        { new: true }
      )
      .populate({
        path: "creator",
        select: "name email avatar",
      })
      .populate({
        path: "participant",
        select: "name email avatar",
      });
    return conversation;
  }

  remove(id: number) {
    return `This action removes a #${id} conversation`;
  }
}
