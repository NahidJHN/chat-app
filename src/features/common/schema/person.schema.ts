import { Prop } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Gender, collectionsName } from "src/features/constant";

export class Person extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collectionsName.user,
    required: true,
  })
  user: string;

  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;
}
