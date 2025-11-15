// @Module is a decorator that marks this class as a Nest.js module
// Modules are the basic building blocks of Nest.js applications
import { Module } from '@nestjs/common';

// Import the controller that handles HTTP requests for users
import UsersController from './users.controller';

// Import the service that contains the business logic for users
import { UsersService } from './users.service';

/**
 * UsersModule organizes all user-related code into one place
 *
 * What is a Module?
 * - A module is a class decorated with @Module()
 * - It groups related controllers, services, and other providers together
 * - Think of it as a "feature folder" for organizing your app
 * - Every Nest.js app has at least one module (the root AppModule)
 *
 * Why use modules?
 * - Keeps code organized by feature (all user stuff in one place)
 * - Makes the app modular and scalable
 * - Controls what's shared between different parts of your app
 * - Nest uses modules to build the dependency injection container
 */
@Module({
  // controllers: An array of controllers that belong to this module
  // Controllers handle incoming HTTP requests and return responses
  // In this case, UsersController handles routes like GET /users, POST /users, etc.
  controllers: [UsersController],

  // providers: An array of services and other injectables that belong to this module
  // "Provider" is Nest's term for any class that can be injected as a dependency
  // Most commonly, providers are services that contain business logic
  // By listing UsersService here, we're telling Nest:
  //   1. Create an instance of UsersService
  //   2. Make it available for injection (like in UsersController's constructor)
  //   3. Manage its lifecycle (Nest creates and destroys it as needed)
  providers: [UsersService],

  // Other module options (not used in this simple example):
  // - imports: Other modules whose exported providers you want to use here
  // - exports: Providers from this module that you want other modules to be able to use
  //   Example: exports: [UsersService] would let other modules inject UsersService
})
export class UsersModule {
  // The class body is usually empty
  // All the configuration happens in the @Module() decorator
  // Nest.js uses the decorator metadata to wire everything together
}
