// Import decorators and utilities from Nest.js
import {
  Body, // Decorator to extract the request body
  Controller, // Decorator to mark a class as a controller
  Delete, // Decorator to handle HTTP DELETE requests
  Get, // Decorator to handle HTTP GET requests
  Param, // Decorator to extract route parameters (like :id)
  ParseIntPipe, // Pipe that converts a string parameter to a number and validates it
  Patch, // Decorator to handle HTTP PATCH requests (partial updates)
  Post, // Decorator to handle HTTP POST requests
} from '@nestjs/common';

// Import the UsersService (contains business logic) and User type
import { UsersService, type User } from './users.service';

// Import DTOs (Data Transfer Objects) that define the shape and validation of request data
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * UsersController handles all HTTP requests related to users
 *
 * What is a Controller?
 * - A controller's job is to receive HTTP requests and return responses
 * - It's the "HTTP layer" of your application
 * - Controllers should be "thin" - they delegate business logic to services
 *
 * The @Controller decorator:
 * - Marks this class as a controller
 * - Takes a string argument that sets the base route
 * - @Controller('users') means all routes in this controller start with /users
 */
@Controller('users')
class UsersController {
  /**
   * Constructor with Dependency Injection
   *
   * What's happening here?
   * - The 'private usersService: UsersService' parameter does TWO things:
   *   1. Creates a private class property called 'usersService'
   *   2. Tells Nest to inject an instance of UsersService
   *
   * How does Nest know what to inject?
   * - Nest looks at the type (UsersService)
   * - Finds it in the module's providers array
   * - Automatically creates an instance and injects it here
   *
   * Why use dependency injection?
   * - You don't have to write: this.usersService = new UsersService()
   * - Nest manages the instance lifecycle for you
   * - Makes testing easier (you can inject a mock service)
   * - Keeps your code loosely coupled
   */
  constructor(private usersService: UsersService) {}

  /**
   * GET /users - Get all users
   *
   * @Get() decorator:
   * - Tells Nest this method handles GET requests
   * - No argument means it matches the base route: /users
   * - Combined with @Controller('users'), the full route is: GET /users
   *
   * Return type:
   * - User[] means this returns an array of User objects
   * - Nest automatically serializes the returned array to JSON
   *
   * Response:
   * - Status code: 200 OK (default for GET)
   * - Body: JSON array of all users
   */
  @Get() // localhost:3000/users
  getUsers(): User[] {
    // Delegate to the service - the controller doesn't contain business logic
    return this.usersService.getUsers();
  }

  /**
   * GET /users/:id - Get a single user by ID
   *
   * @Get(':id') decorator:
   * - Handles GET requests to /users/:id
   * - :id is a route parameter (placeholder for any value)
   * - Examples: /users/1, /users/42, /users/999
   *
   * @Param('id', ParseIntPipe):
   * - @Param extracts the :id value from the URL
   * - 'id' specifies which parameter to extract
   * - ParseIntPipe does TWO things:
   *   1. Converts the string "1" to the number 1
   *   2. Validates that it's a valid integer
   *   3. Returns 400 Bad Request if conversion fails (e.g., /users/abc)
   *
   * Example:
   * - Request: GET /users/5
   * - @Param extracts "5" from the URL
   * - ParseIntPipe converts "5" to number 5
   * - The id parameter receives the number 5
   */
  @Get(':id') // localhost:3000/users/:id
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUser(id);
  }

  /**
   * POST /users - Create a new user
   *
   * @Post() decorator:
   * - Handles POST requests to /users
   * - POST is the standard HTTP method for creating new resources
   *
   * @Body() decorator:
   * - Extracts the request body (the JSON payload)
   * - The body is validated against CreateUserDto automatically
   * - This is because we have ValidationPipe enabled globally in main.ts
   *
   * How validation works:
   * 1. Client sends JSON: { "name": "Alice", "age": 22, "role": "STUDENT" }
   * 2. ValidationPipe checks the data against CreateUserDto decorators
   * 3. If valid: Creates a CreateUserDto instance with the data
   * 4. If invalid: Returns 400 Bad Request with error details
   * 5. Controller receives the validated DTO
   *
   * Response:
   * - Status code: 201 Created (default for POST)
   * - Body: The newly created user object with auto-generated ID
   */
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  /**
   * PATCH /users/:id - Update an existing user
   *
   * @Patch(':id') decorator:
   * - Handles PATCH requests to /users/:id
   * - PATCH is used for partial updates (you don't need to send all fields)
   * - Different from PUT, which typically requires the full object
   *
   * Multiple decorators:
   * - @Param('id', ParseIntPipe) - Extracts and converts the :id from URL
   * - @Body() - Extracts the request body and validates against UpdateUserDto
   *
   * How UpdateUserDto works:
   * - It uses PartialType(CreateUserDto), making all fields optional
   * - You can update just name: { "name": "New Name" }
   * - Or just age: { "age": 30 }
   * - Or multiple fields: { "name": "Bob", "age": 25 }
   *
   * Example:
   * - Request: PATCH /users/2 with body { "age": 34 }
   * - Param extracts id = 2
   * - Body extracts and validates { "age": 34 }
   * - Service updates user #2's age to 34
   * - Returns the updated user object
   *
   * Response:
   * - Status code: 200 OK (default for PATCH)
   * - Body: The updated user object
   */
  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  /**
   * DELETE /users/:id - Delete a user
   *
   * @Delete(':id') decorator:
   * - Handles DELETE requests to /users/:id
   * - DELETE is the standard HTTP method for removing resources
   *
   * Return type:
   * - void means this doesn't return anything
   * - The service removes the user from the array but doesn't return data
   *
   * Example:
   * - Request: DELETE /users/3
   * - Param extracts id = 3
   * - Service removes user #3 from the array
   *
   * Response:
   * - Status code: 200 OK (default for DELETE)
   * - Body: empty (void response)
   */
  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}

export default UsersController;
