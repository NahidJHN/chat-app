import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { appConfig } from "./features/config/app.config";
import { UserModule } from "./features/user/user.module";
import * as Joi from "@hapi/joi";
import { CommonModule } from "./features/common/config.module";
import { AuthModule } from "./features/auth/auth.module";
import { AcceptLanguageResolver, I18nModule, QueryResolver } from "nestjs-i18n";
import { MessageModule } from "./features/message/message.module";
import { ConversationModule } from "./features/conversation/conversation.module";
import { ChatModule } from "./features/chat/chat.module";
import * as path from "path";
import { TasksService } from "./jobs/keep-alive-service";
import { HttpModule } from "@nestjs/axios";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema: Joi.object({
        MONGODB_URL: Joi.required(),
        JWT_SECRET: Joi.string().required(),
        JWT_ACCESS_EXPIRATION_MINUTES: Joi.string().required(),
        JWT_REFRESH_EXPIRATION_DAYS: Joi.number().required(),
        MASTER_PASSWORD: Joi.string().required(),
      }),
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    I18nModule.forRoot({
      fallbackLanguage: "en",
      loaderOptions: {
        path: path.join(__dirname, "/i18n/"),
        watch: true,
      },
      fallbacks: {
        "en-*": "en",
        "bn-*": "bn",
      },
      resolvers: [
        { use: QueryResolver, options: ["lang"] },
        AcceptLanguageResolver,
      ],
    }),
    HttpModule,
    ScheduleModule.forRoot(),
    CommonModule,
    UserModule,
    AuthModule,
    MessageModule,
    ConversationModule,
    ChatModule,
  ],
  controllers: [],
  providers: [TasksService],
})
export class AppModule {}
