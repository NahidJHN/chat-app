import { Document } from "mongoose";
import * as bcrypt from "bcrypt";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UserStatusEnum } from "src/features/constant";

@Schema({ versionKey: false, timestamps: true })
export class User extends Document {
  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  mobile: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String })
  avatar: string;

  @Prop({ type: Boolean })
  isOnline: boolean;

  @Prop({ type: Date })
  lastActiveTime: Date;

  @Prop({ type: String, enum: UserStatusEnum, default: UserStatusEnum.ACTIVE })
  status: UserStatusEnum;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<User>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(this.password, saltRounds);
  this.password = hashedPassword;
  next();
});

export { UserSchema };
