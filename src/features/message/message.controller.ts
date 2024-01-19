import { MessageService } from "./message.service";

import { CreateMessageDto } from "./dto/create-message.dto";
import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { Types } from "mongoose";

@Controller("messages")
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async create(@Body() createMessageDto: CreateMessageDto) {
    const data = await this.messageService.create(createMessageDto);
    return data;
  }

  @Get(":conversationId")
  async findAll(
    @Param("conversationId") conversationId: Types.ObjectId,
    @Query("page") page: string
  ) {
    return await this.messageService.findAll(conversationId, page);
  }
}
