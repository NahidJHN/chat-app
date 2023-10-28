import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";
import { collectionsName } from "src/features/constant";

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: collectionsName.user,
  })
  sender: Types.ObjectId;

  @Prop({ required: true, type: String })
  content: string;

  @Prop({ type: [String], default: [] })
  attachments: string[]; // Assuming you store attachment URLs

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  conversation: Types.ObjectId;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
