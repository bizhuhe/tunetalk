import { Controller, Post, Body, Logger, Get, Param, Put, HttpStatus, Res} from '@nestjs/common';
import { CreateMusicDto } from './create-music.dto';
import { MusicService } from './music.service';
import { Music } from './music.interface';
import { UpdateMusicDto } from './update-music.dto';
import { Response } from 'express';

@Controller('music')
export class MusicController {
  private readonly logger = new Logger(MusicController.name);

  constructor(private readonly musicService: MusicService) {}

  @Post()
  async createMusic(@Body() createMusicDto: CreateMusicDto): Promise<Music | null> {
    this.logger.log('Received request to create music:', createMusicDto);

    try {
      const createdMusic = await this.musicService.create(createMusicDto);
      this.logger.log('Music created successfully:', createdMusic);
      return createdMusic;
    } catch (error) {
      this.logger.error('Failed to create music:', error);
      throw new Error('Failed to create music');
    }
  }
// get the review array for the current music 
  @Get(":id/reviews")
  async getMusicReviews(@Param("id") musicId: string) {
    return this.musicService.getMusicReviews(musicId);
  }

  // get the music by id 
  @Get(":id")
  async getMusic(@Param("id") musicId: string) {
    return this.musicService.getMusicById(musicId);
  }
  // update the music by id 
  @Put(":id")
  update(@Param("id") id: string, @Body() updateMusicDto: UpdateMusicDto, @Res() res: Response) {
    try {
      this.logger.log("Received request to update music ", id);
      this.musicService.updateMusic(id, updateMusicDto);
      // Send a response indicating the update was successful
      res.status(HttpStatus.OK).send("update successful");
    } catch (error) {
      // Handle the error and send an appropriate response
      this.logger.error("Error updating music: ", error);
      res.status(HttpStatus.BAD_REQUEST).send("Failed to update music");
    }
  }
}
