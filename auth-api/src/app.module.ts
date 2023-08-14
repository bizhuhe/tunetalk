import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { HttpModule } from "./http/http.module";
import { SpotifyModule } from "./spofity/spotify.module";
import { UserController } from "./user/user.controller";
import { UserService } from "./user/user.service";
import { userProviders } from "./user/user.providers";
import { databaseProviders } from "./database/database.providers";
import { ReviewController } from "./review/review.controller";
import { ReviewService } from "./review/review.service";
import { reviewProviders } from "./review/review.providers";
import { MusicController } from "./music/music.controller";
import { MusicService } from "./music/music.service";
import { musicProviders } from "./music/music.providers";
import { AuthModule } from './auth/auth.module';
import { SseController } from "./sse/sse.controller";
import { SseService } from "./sse/sse.service";
import { MailerService } from './mailer/mailer.service';
import { SpotifyController } from "./spofity/spofity.controller";
import { SpotifyService } from "./spofity/spotify.service";
import { ReplyController } from "./reply/reply.controller";
import { ReplyService } from "./reply/reply.service";
import { replyProviders } from "./reply/reply.provider";

@Module({
  imports: [ConfigModule.forRoot(), HttpModule, SpotifyModule, 
    AuthModule
  ],
  controllers: [UserController, ReviewController, MusicController, SseController,SpotifyController,ReplyController],
  providers: [
    UserService,
    ReviewService,
    MusicService,
    SseService,
    MailerService,
    SpotifyService,
    ReplyService,
    ...userProviders,
    ...databaseProviders,
    ...reviewProviders,
    ...musicProviders,
    ...replyProviders,
  ],
})
export class AppModule {}
