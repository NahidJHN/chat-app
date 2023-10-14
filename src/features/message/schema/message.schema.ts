import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { User } from "../../user/schema/user.schema"; // You should have a User schema defined
import { collectionsName } from "src/features/constant";

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ type: User, required: true, ref: collectionsName.user })
  sender: User;

  @Prop({ type: User, required: true, ref: collectionsName.user })
  receiver: User;

  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ type: [String], default: [] })
  attachments: string[]; // Assuming you store attachment URLs
}

export const MessageSchema = SchemaFactory.createForClass(Message);
