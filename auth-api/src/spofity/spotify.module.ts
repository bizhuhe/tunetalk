import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios"; // Import HttpModule from @nestjs/axios
import { SpotifyController } from "./spofity.controller";
import { SpotifyService } from "./spotify.service";

@Module({
  imports: [HttpModule], // Use HttpModule from @nestjs/axios
  controllers: [SpotifyController],
  providers: [SpotifyService],
})
export class SpotifyModule {}
