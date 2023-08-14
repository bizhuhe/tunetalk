import { Controller, Get, Param } from '@nestjs/common';
import { SpotifyService } from './spotify.service';

@Controller('spotify')
export class SpotifyController {
  constructor(private spotifyService: SpotifyService) {}

  @Get('album/:id')
  async getAlbum(@Param('id') albumId: string) {
    return this.spotifyService.getAlbum(albumId);
  }

  @Get('search/:query')
  async searchSongs(@Param('query') query: string) {
    return this.spotifyService.searchSongs(query);
  }

  @Get('processed-songs/:playlistId')
  async fetchAndProcessSongs(@Param('playlistId') playlistId: string) {
    return this.spotifyService.fetchAndProcessSongs(playlistId);
  }
}
