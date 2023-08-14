import { Controller, Logger, Post, Body, Get, Param } from "@nestjs/common";
import { Reply } from "./reply.interface";
import { Response } from "express";
import { CreateReplyDto } from "./create-reply.dto";
import { ReviewService } from "src/review/review.service";
import { ReplyService } from "./reply.service";

@Controller("reply")
export class ReplyController {
  private readonly logger = new Logger(ReplyController.name);

  constructor(private replyService: ReplyService) {}
  // create a new reply and post it
  @Post()
  async createReply(
    @Body() createReplyDto: CreateReplyDto
  ): Promise<Reply | null> {
    try {
      this.logger.log("Received request to create a reply");
      const createdReply = await this.replyService.create(createReplyDto);
      this.logger.log("reply created successfully");
      return createdReply;
    } catch (error) {
      this.logger.error("Error creating reply:", error);
      throw new Error("Failed to create reply");
    }
  }
  @Get()
  async getAllReplies(): Promise<Reply[]> {
    return this.replyService.findAll();
  }

@Get(':id')
async getAllRepliesByReviewId(@Param('id') id: string): Promise<Reply[]> {
    return this.replyService.findAllByReviewId(id);
}
}
