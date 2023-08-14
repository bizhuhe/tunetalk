export interface User {
  _id:string;
  email: string
  name: string;
  bio: string;
  createdAt: Date;
  avatar: string;
  reviews :[];
  replies:[],
}
