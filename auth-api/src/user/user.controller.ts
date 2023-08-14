import {
  Controller,
  Body,
  HttpStatus,
  Res,
  Post,
  Get,
  Query,
  Param,
  Put,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./create-user.dto";
import { Response } from "express";
import { User } from "./user.interface";
import { UpdateUserDto } from "./update-user.dto";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Post("/login")
  async create(@Body() createUserDto: CreateUserDto, @Res() response: Response) {
    if (Object.keys(createUserDto).length < 2) {
      // Handle the case where the request body is missing or empty
      response
        .status(HttpStatus.BAD_REQUEST)
        .send("Missing or empty request body");
      return;
    }
    const result = await this.userService.create(createUserDto);
    if (!result) {
      // Handle the case where the email is already in use
      console.log("an existing user login");
    } else {
      // Set the JWT as a HTTP-only cookie
      response.cookie('jwt', result.token, { httpOnly: true });
  
      const existingUser = await this.userService.findByEmail(result.user.email);
      if (existingUser) {
        response.status(HttpStatus.OK).send("User logged in successfully");
      } else {
        response.status(HttpStatus.CREATED).send("This action adds a new user");
      }
    }
  }
  

  //update the user by id
  @Put("/id/:id")
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userService.update(id, updateUserDto);

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  }


  // get the user by email
  @Get("/email/:email")
  async getUserByEmail(@Param("email") email: string): Promise<any> {
    console.log("find by email called");
    try {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        return { message: "User not found" };
      }

      return user;
    } catch (error) {
      throw new Error("Server error");
    }
  }
  // get the user by id
  @Get("/id/:_id")
  async getUserById(@Param("id") id: string): Promise<any> {
    console.log("find by id called");
    try {
      const user = await this.userService.findById(id);
      console.log("user ", user);
      if (!user) {
        return { message: "User not found" };
      }

      return user;
    } catch (error) {
      throw new Error("Server error");
    }
  }
  // get the review array for the current user
  @Get(":id/reviews")
  async getMusicReviews(@Param("id") userId: string) {
    return this.userService.getUserReviews(userId);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
}
