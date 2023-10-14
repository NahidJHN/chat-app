import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { MessageService } from "./message.service";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { Socket } from "socket.io";
import { CreateMessageDto } from "./dto/create-message.dto";
import { Controller, Get, Param } from "@nestjs/common";
import { Types } from "mongoose";

@Controller("messages")
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  // @SubscribeMessage("createMessage")
  // async create(
  //   @MessageBody() createMessageDto: CreateMessageDto,
  //   @ConnectedSocket() client: Socket
  // ) {
  //   const data = await this.messageService.create(createMessageDto);
  //   client.broadcast.emit("createMessage", data);
  //   return data;
  // }

  @Get(":conversationId")
  async findAll(@Param("conversationId") conversationId: Types.ObjectId) {
    return await this.messageService.findAll(conversationId);
  }
}
