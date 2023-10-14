import { Model, Types } from "mongoose";
import { Injectable } from "@nestjs/common";
import { collectionsName } from "../constant";
import { InjectModel } from "@nestjs/mongoose";
import { Message } from "./schema/message.schema";
import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(collectionsName.Message)
    private readonly messageModel: Model<Message>
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    const newMessage = new this.messageModel(createMessageDto);
    return createMessageDto;
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
