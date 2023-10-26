import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { RolesEnum, collectionsName } from "../constant";
import mongoose, { ClientSession, Model, Types } from "mongoose";
import { User } from "./schema/user.schema";
import { Conversation } from "../conversation/schema/conversation.schema";
import { IAuthUser } from "../common";

interface IQuery {
  employee?: Types.ObjectId;
  hod: Types.ObjectId;
}

@Injectable()
export class UserService {
  constructor(
    @InjectModel(collectionsName.user) private readonly userModel: Model<User>,
    @InjectModel(collectionsName.Conversation)
    private readonly conversationModel: Model<Conversation>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);
    return user.save();
  }

  async getUsers(name: string, authUser: IAuthUser): Promise<User[]> {
    return this.userModel.find({
      $and: [
        {
          name: { $regex: name, $options: "i" },
        },
        {
          _id: { $ne: authUser._id },
        },
      ],
    });
  }

  async getUserById(userId: Types.ObjectId): Promise<User> {
    return this.userModel.findById(userId);
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }

  async getParticipantUser(
    userId: Types.ObjectId,
    conversationId: Types.ObjectId
  ): Promise<User> {
    //find the conversation
    const conversation = await this.conversationModel.findById(conversationId);
    if (conversation) {
      //find the user
      const user = await this.userModel.findById(conversation.participant);
      if (user._id.toString() === userId) {
        const user = await this.userModel.findById(conversation.creator);
        return user;
      }
      return user;
    }
  }

  async getAllParticipantUser(userId: string): Promise<User[]> {
    //find the conversation
    console.log(userId);
    const users = await this.conversationModel.aggregate([
      {
        $match: {
          $or: [
            {
              creator: new Types.ObjectId(userId),
            },
            {
              participant: new Types.ObjectId(userId),
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users", // Replace 'users' with the actual name of the collection where user information is stored.
          let: {
            creatorId: "$creator",
            participantId: "$participant",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ["$_id", "$$creatorId"] },
                    { $eq: ["$_id", "$$participantId"] },
                  ],
                },
              },
            },
          ],
          as: "users",
        },
      },
      {
        $unwind: "$users",
      },
      {
        $replaceRoot: {
          newRoot: "$users",
        },
      },
      {
        $match: {
          _id: {
            $ne: new Types.ObjectId(userId),
          },
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          avatar: 1,
          lastActiveTime: 1,
          isOnline: 1,
        },
      },
    ]);
    return users;
  }

  async getUser(query: IQuery): Promise<User> {
    return this.userModel.findOne(query);
  }

  async createAdmin(createUserDto: CreateUserDto): Promise<User> {
    const admin = new this.userModel({
      ...createUserDto,
      role: RolesEnum.ADMIN,
    });
    return admin.save();
  }

  async handleActiveUser(
    userId: Types.ObjectId,
    isActive: boolean
  ): Promise<User> {
    const user = await this.getUserById(userId);
    if (!user) return;
    if (isActive) {
      user.isOnline = true;
    } else {
      user.isOnline = false;
      user.lastActiveTime = new Date();
    }
    return user.save();
  }
}
