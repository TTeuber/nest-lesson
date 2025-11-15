// NestFactory is a class that provides methods to create a Nest.js application instance
// Think of it as the "starter" for your application
import { NestFactory } from '@nestjs/core';

// AppModule is the root module of our application
// It's like the "main container" that holds all other modules
import { AppModule } from './app.module';

// ValidationPipe is a built-in pipe that automatically validates incoming requests
// It works with the class-validator decorators in our DTOs
import { ValidationPipe } from '@nestjs/common';

/**
 * bootstrap() is the entry point of our application
 * It's an async function because starting a server involves asynchronous operations
 *
 * What happens here:
 * 1. Create the Nest application
 * 2. Configure global settings (like validation)
 * 3. Start listening for incoming HTTP requests
 */
async function bootstrap() {
  // NestFactory.create() creates a new Nest application instance
  // It takes our root module (AppModule) and builds the entire dependency injection container
  // The 'await' keyword waits for the app to be fully created before moving forward
  const app = await NestFactory.create(AppModule);

  // useGlobalPipes() applies a pipe to ALL routes in the application
  // This ValidationPipe will:
  //   - Automatically validate all incoming request data against DTOs
  //   - Transform plain JavaScript objects into DTO class instances
  //   - Strip properties that don't exist in the DTO (security feature)
  //   - Return detailed error messages if validation fails (400 Bad Request)
  // Without this line, the @IsString(), @IsNumber(), etc. decorators wouldn't work!
  app.useGlobalPipes(new ValidationPipe());

  // Start the HTTP server and listen for incoming requests
  // process.env.PORT checks if there's a PORT environment variable set
  // The ?? operator means "if PORT is undefined, use 3000 instead"
  // This makes deployment easier (cloud platforms like Heroku set PORT automatically)
  // Example: Your app will be available at http://localhost:3000
  await app.listen(process.env.PORT ?? 3000);
}

// Call the bootstrap function to start the application
// This is what actually runs when you execute "npm run start"
bootstrap();
