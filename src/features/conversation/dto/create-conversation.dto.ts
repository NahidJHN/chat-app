import { IsMongoId, IsNotEmpty } from "class-validator";

export class CreateConversationDto {
  @IsNotEmpty({ message: "creator is required" })
  @IsMongoId({ message: "Invalid Creator" })
  creator: string;

  @IsNotEmpty({ message: "participant is required" })
  @IsMongoId()
  participant: string;
}
