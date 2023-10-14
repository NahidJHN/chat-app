import { Controller, Get, Post, Body, Param, Delete } from "@nestjs/common";
import { ConversationService } from "./conversation.service";
import { Types } from "mongoose";
import { Conversation } from "./schema/conversation.schema";
import { CreateConversationDto } from "./dto/create-conversation.dto";

@Controller("conversations")
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  async create(@Body() createConversationDto: CreateConversationDto) {
    const data = await this.conversationService.create(createConversationDto);
    return data;
  }

  @Get("/:userId")
  async getAll(
    @Param("userId") userId: Types.ObjectId
  ): Promise<Conversation[]> {
    const data = await this.conversationService.findAll(userId);
    return data;
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.conversationService.remove(+id);
  }
}
