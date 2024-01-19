import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateConversationDto } from "./dto/create-conversation.dto";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { collectionsName } from "../constant";
import { Conversation } from "./schema/conversation.schema";
import { ClientSession, Connection, Model, SchemaTypes, Types } from "mongoose";
import { GroupConversation } from "./schema/group-conversation.schema";
import { PrivateConversation } from "./schema/private-conversation.schema";

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(collectionsName.Conversation)
    private readonly conversationModel: Model<Conversation>,
    @InjectModel(collectionsName.GroupConversation)
    private readonly groupConversationModel: Model<GroupConversation>,
    @InjectModel(collectionsName.PrivateConversation)
    private readonly privateConversationModel: Model<PrivateConversation>,
    @InjectConnection() private readonly connection: Connection
  ) {}

  async create(
    createConversationDto: CreateConversationDto
  ): Promise<Conversation> {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();

      let conversation = new this.conversationModel({
        participants: [
          ...createConversationDto.participants,
          createConversationDto.creator,
        ],
        type: createConversationDto.type,
      });
      if (createConversationDto.type === "group") {
        const groupConversation = new this.groupConversationModel({
          name: createConversationDto.name,
          admin: [createConversationDto.creator],
          members: [
            ...createConversationDto.participants,
            createConversationDto.creator,
          ],
          conversation: conversation._id,
        });
        conversation.groupConversation = groupConversation._id;

        await groupConversation.save({ session });
      } else {
        const privateConversation = new this.privateConversationModel({
          conversation: conversation._id,
          creator: createConversationDto.creator,
          participant: createConversationDto.participants[0],
          name: createConversationDto.name,
        });
        conversation.privateConversation = privateConversation._id;

        await privateConversation.save({ session });
      }
      await conversation.save({ session });
      await session.commitTransaction();

      return conversation;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    }
  }

  async findAll(userId: Types.ObjectId): Promise<Conversation[]> {
    const data = this.conversationModel
      .find({
        participants: {
          $in: [userId],
        },
      })
      .sort({ lastUpdate: -1 })

      .populate("lastMessage")
      .exec();
    return data;
  }

  async findGroupConversations(
    userId: Types.ObjectId
  ): Promise<GroupConversation[]> {
    const data = this.groupConversationModel
      .find({
        members: { $in: [userId] },
      })
      .exec();
    return data;
  }

  async findPrivateConversations(
    userId: Types.ObjectId
  ): Promise<PrivateConversation[]> {
    const data = this.privateConversationModel
      .find({
        $or: [{ creator: userId }, { participant: userId }],
      })
      .exec();
    return data;
  }

  //find the participant from the conversation and return all participant only
  async findAllParticipants(userId: Types.ObjectId): Promise<Conversation[]> {
    const conversation = await this.conversationModel.aggregate([
      {
        $match: {
          participants: {
            $in: [new Types.ObjectId(userId)],
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "participants",
          foreignField: "_id",
          as: "participants",
        },
      },
      {
        $unwind: "$participants",
      },
      {
        $match: {
          "participants._id": { $ne: new Types.ObjectId(userId) },
        },
      },
      {
        $addFields: {
          "participants.conversationId": "$_id",
        },
      },
      {
        $replaceRoot: {
          newRoot: "$participants",
        },
      },
    ]);

    return conversation;
  }

  async updateConversation(
    userId: Types.ObjectId,
    conversationId: Types.ObjectId,
    messageId: Types.ObjectId,
    session: ClientSession
  ): Promise<Conversation> {
    const conversation = await this.conversationModel
      .findByIdAndUpdate(
        conversationId,
        {
          $set: {
            lastMessage: messageId,
            lastUpdate: new Date(),
            readPersons: [userId],
          },
        },
        { session, new: true }
      )
      .populate("lastMessage")
      .exec();
    console.log("conversation======>", conversation);
    return conversation;
  }

  async updateIsRead(
    userId: Types.ObjectId,
    conversationId: Types.ObjectId
  ): Promise<Conversation> {
    const conversation = await this.conversationModel
      .findByIdAndUpdate(
        conversationId,
        { $push: { readPersons: userId } },
        { new: true }
      )
      .populate("lastMessage")
      .exec();
    console.log("read======>", conversation);
    return conversation;
  }

  async getActiveConversation(
    conversationId: Types.ObjectId,
    userId: Types.ObjectId
  ) {
    const findConversation = await this.conversationModel
      .findById(conversationId)
      .populate({
        path: "lastMessage",
        select: "content attachments sender conversation createdAt",
      });

    const conversation = findConversation.toObject();

    if (conversation.type === "group") {
      const groupConversation = await this.groupConversationModel
        .findById(conversation.groupConversation)
        .populate({
          path: "members",
          select: "name isOnline _id",
        });
      if (groupConversation) {
        conversation["isOnline"] = groupConversation.members.some(
          (member) => member["isOnline"]
        );
        conversation["name"] = groupConversation.name;
      }
    }

    if (conversation.type === "dual") {
      const privateConversation = await this.privateConversationModel
        .findById(conversation.privateConversation)
        .populate({
          path: "participant",
          select: "name isOnline _id lastActiveTime avatar",
        })
        .populate({
          path: "creator",
          select: "name isOnline _id lastActiveTime avatar",
        });
      if (privateConversation) {
        const participant =
          privateConversation.creator._id.toString() === userId.toString()
            ? privateConversation.participant
            : privateConversation.creator;

        conversation["name"] = participant["name"];
        conversation["isOnline"] = participant["isOnline"];
        conversation["lastActiveTime"] = participant["lastActiveTime"];
        conversation["avatar"] = participant["avatar"];
      }
    }

    //remove the userId from the conversation participant array
    conversation.participants = conversation.participants.filter(
      (participant) => participant["_id"].toString() !== userId.toString()
    );

    return conversation;
  }
}
