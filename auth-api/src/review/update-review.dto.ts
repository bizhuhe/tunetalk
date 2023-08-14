export class UpdateReviewDto {
    rating?: number;
    comment?: String;

    constructor(rating?: number, comment?: String) {
        this.rating = rating;
        this.comment = comment;
    }
}
