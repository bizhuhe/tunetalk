import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Review } from "./review-data.service";
import { Router } from '@angular/router';
import { AuthorizeService } from './auth.service';

export interface User {
  _id:string;
  email: string
  name: string;
  bio: string;
  createdAt: Date;
  avatar: string;
  reviews :any[];
}

@Injectable({
  providedIn: "root",
})
export class UserDataService {
  user : User = {
    _id: '',
    email: '',
    name: '',
    bio: '',
    createdAt: new Date(),
    avatar: '',
    reviews :[],
  };

  users: User[] = [];
  
 
  userUpdated: EventEmitter<User> = new EventEmitter<User>();
  constructor(private http: HttpClient, private router: Router, private authorizeService: AuthorizeService) {}


  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>("http://localhost:3000/user");
  }
  

  getCurrentUser(email: string): Promise<User> {
    return this.http.get<User>(`http://localhost:3000/user/email/${email}`).toPromise() as Promise<User>;
  }
  getCurrentUserById(id: string): Promise<User> {
    return this.http.get<User>(`http://localhost:3000/user/id/${id}`).toPromise() as Promise<User>;
  }
  
  
  editUser(id: string, updatedUser: any): Observable<any> {
    return this.http.put(`http://localhost:3000/user/id/${id}`, updatedUser);
  }


  openPersonalPage(email:string){
    this.getCurrentUser(email).then((user: User) => {
      this.user = user;
      console.log("get the user ",this.user); // Add this line to check if user is correctly retrieved.
      this.router.navigate(['/userPage', this.user._id], { state: { user: this.user } });
    });
  }
  
  emitReviewUpdated(user: User) {
    this.userUpdated.emit(user);
  }

}