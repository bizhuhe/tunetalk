import { Injectable, Inject } from "@nestjs/common";
import { User } from "./user.interface";
import { Model } from "mongoose";
import { CreateUserDto } from "./create-user.dto";
import { UpdateUserDto } from "./update-user.dto";
import { Review } from "../review/review.interface";
import * as jwt from 'jsonwebtoken';
import { UserResponse } from "./user-response.interface";



@Injectable()
export class UserService {
  private readonly users: User[] = [];

  constructor(
    @Inject("USER_MODEL")
    private userModel: Model<User>,
    @Inject("REVIEW_MODEL")
    private reviewModel: Model<Review>
  ) {}

  
  async create(createUserDto: CreateUserDto): Promise<UserResponse | null> {
      const { name, email } = createUserDto;
      // Check if the email already exists in the database
      const existingUser = await this.userModel.findOne({ email });

      if (existingUser) {
        return null; // Return null to indicate duplication
      }
  
      // Create the new user
      const createdUser = new this.userModel({ name, email });
      try {
        const savedUser = await createdUser.save();
  
        // Generate a JWT for the user
        const token = jwt.sign({ userId: savedUser._id, username: savedUser.name }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // Return the saved user and token
        return { user: savedUser, token };
      } catch (error) {
        console.log("Error saving user:", error);
        // Handle any other errors that may occur during the save operation
        throw new Error("Failed to create user");
      }
  }
  

  // update a user
  async update(
    userId: string,
    updateUserDto: UpdateUserDto
  ): Promise<User | null> {
    // Find the user by their _id
    const user = await this.userModel.findById(userId);

    // If no user is found with the given _id, return null
    if (!user) {
      return null;
    }
    // If the user is found, update their bio and avatar
    user.bio = updateUserDto.bio;
    user.avatar = updateUserDto.avatar;
    // Save the updated user
    await user.save();
    // Return the updated user
    return user;
  }

  // find user by email
  findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  // find user by id
  findById(id: string): Promise<User | null> {
    return this.userModel.findOne({ id }).exec();
  }
// get all the reviews from one user
  async getUserReviews(userId: string): Promise<Review[]> {
    console.log("find reviews for ", userId);
    const user = await this.userModel.findOne({ _id: userId });
    
    if (!user) {
      return []; // Return an empty array when there are no reviews
    }
    const reviewIds = user.reviews.map((id) => id); // Convert review IDs to strings
    // Retrieve the reviews based on the review IDs
    const reviews = await this.reviewModel.find({ _id: { $in: reviewIds } });
    console.log("the current user ", user);
    console.log("get the review for music ", reviews);
    return reviews;
  }

  async findAll(): Promise<User[]> {
    try {
      const users = await this.userModel.find().exec();
      console.log("get all the users ", users);
      return users;
    } catch (error) {
      console.log("Error retrieving users:", error);
      throw new Error("Failed to retrieve users");
    }
  }
}
