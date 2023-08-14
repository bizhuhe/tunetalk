import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import mongoose from 'mongoose';
require('dotenv').config();


async function bootstrap() {
  const server = express();

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  const uri = "mongodb+srv://bizhuhe:bizhuhe@cluster0.lb4oacn.mongodb.net/?retryWrites=true&w=majority";
  async function connect() {
    try {
      await mongoose.connect(uri);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.log(error);
    }
  }
  // connect();
  // Enable CORS
  app.enableCors();


  await app.listen(3000);
}
bootstrap();
