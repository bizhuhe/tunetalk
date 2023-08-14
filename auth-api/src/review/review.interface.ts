export interface Review {
  _id: string;
    user: string;
    userName:string;
    song: string;
    songName:string;
    image:string;
    rating: number;
    comment: string;
    likes: number;
    likedByUsers: string[];
    replies: string[];
    createdAt: Date;

  }
  
  