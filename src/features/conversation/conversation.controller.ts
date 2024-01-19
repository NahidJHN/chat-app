import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { ConversationService } from "./conversation.service";
import { Types } from "mongoose";
import { Conversation } from "./schema/conversation.schema";
import { CreateConversationDto } from "./dto/create-conversation.dto";
import { GroupConversation } from "./schema/group-conversation.schema";
import { PrivateConversation } from "./schema/private-conversation.schema";
import { IAuthUser } from "../common";
import { AuthUser } from "../common/decorator/authUser.decorator";

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

  @Get("group/:userId")
  async getGroupConversations(
    @Param("userId") userId: Types.ObjectId
  ): Promise<GroupConversation[]> {
    const data = await this.conversationService.findGroupConversations(userId);
    return data;
  }

  @Get("private/:userId")
  async getPrivateConversations(
    @Param("userId") userId: Types.ObjectId
  ): Promise<PrivateConversation[]> {
    const data = await this.conversationService.findPrivateConversations(
      userId
    );
    return data;
  }

  @Get("participants/:userId")
  async getParticipantByUserId(
    @Param("userId") userId: Types.ObjectId
  ): Promise<Conversation[]> {
    const data = await this.conversationService.findAllParticipants(userId);
    return data;
  }

  @Get("active/:conversationId")
  async getActiveParticipants(
    @Param("conversationId") conversationId: Types.ObjectId,
    @AuthUser() user: IAuthUser
  ): Promise<any> {
    const data = await this.conversationService.getActiveConversation(
      conversationId,
      user._id
    );
    return data;
  }
}
