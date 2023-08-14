
import { Injectable, Res } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class SseService {
  async createSseResponse(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Send the initial event
    res.write(`data: ${JSON.stringify({ message: 'Connected' })}\n\n`);
    // console.log('Initial event sent:', { message: 'Connected' });

    setInterval(() => {
      // Send a periodic event
      res.write(`data: ${JSON.stringify({ message: 'Event' })}\n\n`);
      // console.log('Periodic event sent:', { message: 'Event' });
    }, 1000);
  }
}
