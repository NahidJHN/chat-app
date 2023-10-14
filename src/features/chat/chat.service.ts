import { Injectable } from "@nestjs/common";
import { CreateChatDto } from "./dto/create-chat.dto";
import { UpdateChatDto } from "./dto/update-chat.dto";
import { InjectModel } from "@nestjs/mongoose";
import { MessageService } from "../message/message.service";
import { Message } from "../message/schema/message.schema";

@Injectable()
export class ChatService {
  constructor(private readonly messageService: MessageService) {}

  async create(createChatDto: CreateChatDto): Promise<Message> {
    delete createChatDto.socketId;
    const message = await this.messageService.create(createChatDto);
    return message;
  }

  findAll() {
    return `This action returns all chat`;
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
