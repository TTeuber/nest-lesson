// Injectable: Marks this class as a provider that can be injected via dependency injection
// NotFoundException: A built-in Nest exception that returns HTTP 404 Not Found
import { Injectable, NotFoundException } from '@nestjs/common';

// Import DTOs that define the structure for creating and updating users
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * User interface defines the shape of a user object
 *
 * What is an interface?
 * - An interface is a TypeScript feature that defines the structure of an object
 * - It's like a contract that says "a User must have these exact properties"
 * - Interfaces only exist at compile-time (they disappear when TypeScript is compiled to JavaScript)
 *
 * Why export it?
 * - Other files (like the controller) need to know what a User looks like
 * - Used for type checking: getUsers(): User[] tells TypeScript to expect an array of Users
 */
export interface User {
  id: number;                              // Unique identifier for the user
  name: string;                            // User's name
  age: number;                             // User's age
  role: 'TEACHER' | 'STUDENT' | 'ADMIN';   // Union type: role can ONLY be one of these three strings
}

/**
 * UsersService contains all the business logic for managing users
 *
 * What is a Service?
 * - A service is where you put your business logic and data manipulation
 * - It's separate from the controller (which handles HTTP stuff)
 * - Services are reusable and can be injected into multiple controllers
 *
 * @Injectable() decorator:
 * - Marks this class as a "provider" in Nest's dependency injection system
 * - Without this decorator, you couldn't inject this service into the controller
 * - Tells Nest: "This class can be created and managed by the DI container"
 *
 * In a real app:
 * - This service would interact with a database (PostgreSQL, MongoDB, etc.)
 * - For learning purposes, we're using an in-memory array instead
 */
@Injectable()
export class UsersService {
  /**
   * In-memory data storage
   *
   * private: Only accessible within this class (can't be accessed from outside)
   * users: Name of the property
   * User[]: Type is an array of User objects
   *
   * Important Notes:
   * - This data is stored in memory, so it resets when you restart the server
   * - In a production app, you'd use a real database (Prisma, TypeORM, etc.)
   * - We're using this approach to keep the example simple for learning
   *
   * The array starts with 3 sample users
   */
  private users: User[] = [
    { id: 1, name: 'Tyler', age: 26, role: 'TEACHER' },
    { id: 2, name: 'John', age: 33, role: 'STUDENT' },
    { id: 3, name: 'Stan', age: 50, role: 'ADMIN' },
  ];

  /**
   * READ - Get all users
   *
   * What it does:
   * - Returns the entire users array
   * - In a real app, this might query a database: SELECT * FROM users
   *
   * Example response:
   * [
   *   { id: 1, name: 'Tyler', age: 26, role: 'TEACHER' },
   *   { id: 2, name: 'John', age: 33, role: 'STUDENT' },
   *   { id: 3, name: 'Stan', age: 50, role: 'ADMIN' }
   * ]
   */
  getUsers() {
    return this.users;
  }

  /**
   * READ - Get a single user by ID
   *
   * @param id - The ID of the user to find
   *
   * What it does:
   * - Uses Array.find() to search for a user with matching id
   * - find() returns the first element that matches the condition
   * - Returns undefined if no user is found
   *
   * How Array.find() works:
   * - find() loops through the array
   * - For each user, it runs the callback: (user) => user.id === id
   * - If the callback returns true, find() returns that user
   * - If no match is found, find() returns undefined
   *
   * Example:
   * - getUser(2) returns { id: 2, name: 'John', age: 33, role: 'STUDENT' }
   * - getUser(999) returns undefined (no user with id 999)
   *
   * In a real app:
   * - This would be a database query like: SELECT * FROM users WHERE id = ?
   */
  getUser(id: number) {
    const user = this.users.find((user) => user.id === id);
    return user;
  }

  /**
   * CREATE - Add a new user
   *
   * @param createUserDto - Validated data for creating a user (name, age, role)
   *
   * What it does:
   * 1. Finds the highest ID in the current users array
   * 2. Creates a new user with ID = maxId + 1
   * 3. Adds the new user to the array
   * 4. Returns the newly created user
   *
   * Step-by-step breakdown:
   *
   * 1. Math.max(...this.users.map(user => user.id))
   *    - this.users.map(user => user.id) creates an array of just the IDs: [1, 2, 3]
   *    - ...spread operator unpacks the array: Math.max(1, 2, 3)
   *    - Math.max() returns the largest number: 3
   *
   * 2. { id: maxId + 1, ...createUserDto }
   *    - Creates a new object with id: 4 (if maxId was 3)
   *    - ...createUserDto spreads the DTO properties (name, age, role)
   *    - Result: { id: 4, name: 'Alice', age: 22, role: 'STUDENT' }
   *
   * 3. this.users.push(newUser)
   *    - Adds the new user to the end of the array
   *
   * 4. return newUser
   *    - Returns the created user so the client knows what was created
   *
   * In a real app:
   * - The database would auto-generate the ID (AUTO_INCREMENT in SQL)
   * - You'd execute: INSERT INTO users (name, age, role) VALUES (?, ?, ?)
   */
  createUser(createUserDto: CreateUserDto) {
    const maxId = Math.max(...this.users.map((user) => user.id));
    const newUser: User = { id: maxId + 1, ...createUserDto };
    this.users.push(newUser);
    return newUser;
  }

  /**
   * UPDATE - Modify an existing user
   *
   * @param id - The ID of the user to update
   * @param updateUserDto - Validated data with the fields to update (all optional)
   *
   * What it does:
   * 1. Finds the user by ID
   * 2. If user doesn't exist, throws a 404 error
   * 3. Updates only the fields that were provided in the DTO
   * 4. Returns the updated user
   *
   * Error handling:
   * - throw new NotFoundException() creates an HTTP 404 response
   * - Nest automatically catches this exception and sends it to the client
   * - Client receives: { statusCode: 404, message: 'user with that id not found' }
   *
   * Partial update logic:
   * - if (updateUserDto.name) checks if name was provided
   * - Only updates the field if it exists in the DTO
   * - This allows updating just one field without affecting others
   *
   * Example:
   * - updateUser(2, { age: 34 })
   * - Finds user #2, updates ONLY age to 34, keeps name and role unchanged
   * - Returns { id: 2, name: 'John', age: 34, role: 'STUDENT' }
   *
   * In a real app:
   * - You'd execute: UPDATE users SET age = ? WHERE id = ?
   */
  updateUser(id: number, updateUserDto: UpdateUserDto) {
    // First, try to find the user
    const user = this.getUser(id);

    // If user doesn't exist, throw an exception
    // This automatically returns HTTP 404 to the client
    if (!user) {
      throw new NotFoundException('user with that id not found');
    }

    // Update only the fields that were provided in the DTO
    // The if statements prevent overwriting with undefined values
    if (updateUserDto.name) user.name = updateUserDto.name;
    if (updateUserDto.age) user.age = updateUserDto.age;
    if (updateUserDto.role) user.role = updateUserDto.role;

    // Return the updated user object
    // Since 'user' is a reference to the object in the array,
    // the changes are already reflected in this.users
    return user;
  }

  /**
   * DELETE - Remove a user
   *
   * @param id - The ID of the user to delete
   *
   * What it does:
   * - Uses Array.filter() to create a new array without the specified user
   * - Replaces the users array with the filtered result
   *
   * How Array.filter() works:
   * - filter() creates a new array
   * - For each user, it runs the callback: (user) => user.id !== id
   * - If callback returns true, the user is kept in the new array
   * - If callback returns false, the user is excluded
   *
   * Example:
   * - Before: [{ id: 1 }, { id: 2 }, { id: 3 }]
   * - deleteUser(2) filters to: [{ id: 1 }, { id: 3 }]
   * - User with id: 2 is removed
   *
   * Note:
   * - This doesn't throw an error if the user doesn't exist
   * - It just silently does nothing (filter returns the same array)
   * - You could add error handling similar to updateUser if needed
   *
   * In a real app:
   * - You'd execute: DELETE FROM users WHERE id = ?
   */
  deleteUser(id: number) {
    // Filter keeps all users EXCEPT the one with the matching id
    // !== means "not equal to"
    this.users = this.users.filter((user) => user.id !== id);
  }
}
