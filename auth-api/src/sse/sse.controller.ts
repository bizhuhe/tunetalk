
import { Controller, Get, Res } from '@nestjs/common';
import { SseService } from './sse.service';
import { Response } from 'express';

@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Get('stream')
  stream(@Res() res: Response): void {
    this.sseService.createSseResponse(res);
  }
}
