import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";
import { collectionsName } from "src/features/constant";

@Schema({ timestamps: true })
export class GroupConversation extends Document {
  @Prop({
    type: String,
    required: true,
    ref: collectionsName.user,
  })
  name: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: collectionsName.user,
  })
  admin: Types.ObjectId[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: collectionsName.user,
  })
  members: Types.ObjectId[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: collectionsName.Message,
  })
  messages: Types.ObjectId[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: collectionsName.Conversation,
  })
  conversation: Types.ObjectId;
}

export const GroupConversationSchema =
  SchemaFactory.createForClass(GroupConversation);
