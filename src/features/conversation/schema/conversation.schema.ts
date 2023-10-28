import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";
import { collectionsName } from "src/features/constant";

@Schema({ timestamps: true })
export class Conversation extends Document {
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: collectionsName.user,
  })
  participants: Types.ObjectId[];

  @Prop({ type: Date, default: Date.now })
  lastUpdate: Date;

  @Prop({ type: Array<mongoose.Schema.Types.ObjectId> })
  readPersons: Types.ObjectId[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: collectionsName.Message })
  lastMessage: Types.ObjectId;

  @Prop({ type: String, default: "dual", enum: ["dual", "group"] })
  type: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collectionsName.GroupConversation,
  })
  groupConversation: Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collectionsName.PrivateConversation,
  })
  privateConversation: Types.ObjectId;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
