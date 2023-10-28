import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";
import { collectionsName } from "src/features/constant";

@Schema({ timestamps: true })
export class PrivateConversation extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: collectionsName.user,
  })
  creator: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: collectionsName.user,
  })
  participant: Types.ObjectId;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: collectionsName.Message,
  })
  messages: Types.ObjectId[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collectionsName.Conversation,
    required: true,
  })
  conversation: Types.ObjectId;
}

export const PrivateConversationSchema =
  SchemaFactory.createForClass(PrivateConversation);
