import { HttpClient } from "@angular/common/http";
import { Component, Output, EventEmitter, Input } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthorizeService } from "src/app/auth.service";
import { InputService } from "src/app/input.service";
export interface Reply {
  user: string;
  userName: string;
  reply: string;
  review: string;
  createdAt: Date;
}
@Component({
  selector: "app-reply-input",
  templateUrl: "./reply-input.component.html",
  styleUrls: ["./reply-input.component.css"],
})
export class ReplyInputComponent {
  @Input() review: any;
  @Output() totalReplies = new EventEmitter<number>();

  @Output() replySubmitted: EventEmitter<any> = new EventEmitter();
  editing = false;
  formSubmitted = false;
  replyBeingEdited: Reply | undefined;
  replyText: string;
  replies: Reply[] = [];
  constructor(
    private authorizeService: AuthorizeService,
    private inputService: InputService,
    private http: HttpClient
  ) {}

  reply: any = {
    user: "",
    userName: "",
    reply: "",
    review: "",
    createdAt: new Date(),
  };
  ngOnInit(): void {
    this.getRepliesForCurrentReview();
  }

  getRepliesForCurrentReview() {
    this.http
      .get<Reply[]>(`http://localhost:3000/reply/${this.review._id}`)
      .subscribe(
        (replies) => {
          this.replies = replies;
          this.totalReplies.emit(this.replies.length);
        },
        (error) => {
          console.error("Error getting replies:", error);
        }
      );
  }
  newReplyClick() {
    this.editing = true;
  }

  editReply(currentReply: any) {
    this.inputService.editInput(this, currentReply);
  }
 

  resetForm(form: NgForm) {
    this.inputService.resetForm(this, form);
  }
  submitForm(form: NgForm) {
    if (form.valid && this.reply.reply) {
      const replyInformation = this.createReplyInformation();
      // const musicInformation = this.createMusicInformation(reviewInformation);
      this.createReply(replyInformation);
      // this.createMusic(musicInformation);
      this.formSubmitted = true;
      this.resetForm(form);
      this.replySubmitted.emit();
    }
  }
  createReplyInformation() {
    const replyInformation = {
      user: this.authorizeService.email,
      userName: this.authorizeService.userName,
      reply: this.reply.reply,
      review: this.review._id,
      createdAt: new Date(),
    };
    return replyInformation;
  }

  createReply(replyInformation: any) {
    this.http
      .post("http://localhost:3000/reply", replyInformation, {
        responseType: "text",
      })
      .subscribe((response) => {
        // add the new reply to the reply array
        this.replies.push(replyInformation);
        this.totalReplies.emit(this.replies.length);
      });
  }
}
