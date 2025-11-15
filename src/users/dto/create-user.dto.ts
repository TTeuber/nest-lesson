// Import validation decorators from the class-validator library
// class-validator is a popular library for validating data in TypeScript classes
import { IsEnum, IsNumber, IsString, Min, MinLength } from 'class-validator';

/**
 * CreateUserDto (Data Transfer Object) defines the structure and validation rules
 * for creating a new user
 *
 * What is a DTO?
 * - DTO stands for "Data Transfer Object"
 * - It's a class that defines what data can be sent in a request
 * - It includes validation rules using decorators
 * - DTOs are used to validate and type-check incoming request data
 *
 * Why use a class instead of an interface?
 * - Interfaces disappear when TypeScript compiles to JavaScript
 * - Classes exist at runtime, so decorators can add metadata to them
 * - The ValidationPipe uses this metadata to validate incoming data
 *
 * How validation works:
 * 1. Client sends JSON: { "name": "Alice", "age": 22, "role": "STUDENT" }
 * 2. Nest's ValidationPipe (configured in main.ts) intercepts the request
 * 3. ValidationPipe transforms the JSON into a CreateUserDto instance
 * 4. ValidationPipe checks all the decorator rules (@IsString, @MinLength, etc.)
 * 5. If valid: Request continues to the controller
 * 6. If invalid: Returns 400 Bad Request with detailed error messages
 *
 * Example validation error response:
 * {
 *   "statusCode": 400,
 *   "message": ["age must not be less than 13"],
 *   "error": "Bad Request"
 * }
 */
export class CreateUserDto {
  /**
   * User's name
   *
   * Validation rules:
   *
   * @IsString() - Ensures the value is a string type
   * - Fails if: name is a number, boolean, object, array, etc.
   * - Example valid: "Alice", "Bob Smith"
   * - Example invalid: 123, true, { "first": "Alice" }
   *
   * @MinLength(1) - Ensures the string has at least 1 character
   * - Prevents empty strings
   * - Example valid: "A", "Alice"
   * - Example invalid: "" (empty string)
   *
   * TypeScript type:
   * - name: string tells TypeScript this property must be a string
   * - Provides type checking at compile time (before running the code)
   */
  @IsString()
  @MinLength(1)
  name: string;

  /**
   * User's age
   *
   * Validation rules:
   *
   * @IsNumber() - Ensures the value is a number type
   * - Fails if: age is a string, boolean, object, etc.
   * - Example valid: 20, 42, 100
   * - Example invalid: "20", true, null
   * - Note: JSON numbers are automatically parsed as numbers
   *
   * @Min(13) - Ensures the number is at least 13
   * - Sets a minimum age requirement
   * - Example valid: 13, 20, 100
   * - Example invalid: 12, 0, -5
   *
   * Business logic:
   * - This enforces a minimum age of 13 for users
   * - Common requirement for online services
   */
  @IsNumber()
  @Min(13)
  age: number;

  /**
   * User's role in the system
   *
   * Validation rules:
   *
   * @IsEnum(['TEACHER', 'STUDENT', 'ADMIN']) - Ensures the value is one of the allowed options
   * - The array ['TEACHER', 'STUDENT', 'ADMIN'] lists the ONLY valid values
   * - Provides strict type safety - prevents typos and invalid roles
   * - Example valid: "TEACHER", "STUDENT", "ADMIN"
   * - Example invalid: "teacher" (wrong case), "PARENT", "user", 123
   *
   * TypeScript type:
   * - 'TEACHER' | 'STUDENT' | 'ADMIN' is a union type
   * - The | symbol means "or" - role can be TEACHER or STUDENT or ADMIN
   * - This is more specific than just string - TypeScript knows the exact allowed values
   * - Provides autocomplete in your IDE!
   *
   * Why use both @IsEnum() and the union type?
   * - Union type: Compile-time type checking (catches errors while coding)
   * - @IsEnum(): Runtime validation (catches errors from API requests)
   * - Both together provide complete type safety!
   */
  @IsEnum(['TEACHER', 'STUDENT', 'ADMIN'])
  role: 'TEACHER' | 'STUDENT' | 'ADMIN';
}
