import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";
import { User } from "../../user/schema/user.schema"; // You should have a User schema defined
import { collectionsName } from "src/features/constant";

@Schema({ timestamps: true })
export class Conversation extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: collectionsName.user,
  })
  creator: Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: collectionsName.user,
  })
  participant: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  lastUpdate: Date;

  @Prop({ type: Boolean, default: false })
  isRead: boolean;

  @Prop({ type: String, default: "" })
  lastMessage: Types.ObjectId;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
