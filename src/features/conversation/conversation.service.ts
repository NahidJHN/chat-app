import { Injectable } from "@nestjs/common";
import { CreateConversationDto } from "./dto/create-conversation.dto";
import { InjectModel } from "@nestjs/mongoose";
import { collectionsName } from "../constant";
import { Conversation } from "./schema/conversation.schema";
import { ClientSession, Model, Types } from "mongoose";

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

  remove(id: number) {
    return `This action removes a #${id} conversation`;
  }
}
