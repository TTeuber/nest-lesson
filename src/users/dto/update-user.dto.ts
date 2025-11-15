// PartialType is a utility function from @nestjs/mapped-types
// It takes a DTO class and creates a new class with all properties made optional
import { PartialType } from '@nestjs/mapped-types';

// Import the CreateUserDto to reuse its structure and validation rules
import { CreateUserDto } from './create-user.dto';

/**
 * UpdateUserDto defines the structure and validation rules for updating a user
 *
 * What does this code do?
 * - extends PartialType(CreateUserDto) creates a new class that:
 *   1. Has ALL the same properties as CreateUserDto (name, age, role)
 *   2. Makes ALL properties OPTIONAL (you don't have to provide all of them)
 *   3. Keeps ALL the validation rules from CreateUserDto
 *
 * Why is this useful?
 * - When updating, you often want to change just ONE field (like age)
 * - You don't want to require ALL fields like when creating
 * - But you still want the same validation rules (age must be >= 13 if provided)
 *
 * DRY Principle (Don't Repeat Yourself):
 * - We don't duplicate the @IsString(), @Min(13), etc. decorators
 * - We reuse CreateUserDto as the single source of truth
 * - If we change validation in CreateUserDto, UpdateUserDto updates automatically
 *
 * What PartialType() actually does behind the scenes:
 * - It's equivalent to writing this manually (but much cleaner!):
 *
 *   export class UpdateUserDto {
 *     @IsString()
 *     @MinLength(1)
 *     @IsOptional()    // <-- Makes it optional
 *     name?: string;   // <-- The ? means optional
 *
 *     @IsNumber()
 *     @Min(13)
 *     @IsOptional()    // <-- Makes it optional
 *     age?: number;    // <-- The ? means optional
 *
 *     @IsEnum(['TEACHER', 'STUDENT', 'ADMIN'])
 *     @IsOptional()    // <-- Makes it optional
 *     role?: 'TEACHER' | 'STUDENT' | 'ADMIN';  // <-- The ? means optional
 *   }
 *
 * How it works in practice:
 *
 * Example 1: Update just the age
 * - Request: PATCH /users/1 with body { "age": 27 }
 * - Validation: age is validated (must be number >= 13) ✓
 * - Result: Only age is updated, name and role stay the same
 *
 * Example 2: Update multiple fields
 * - Request: PATCH /users/1 with body { "name": "Bob", "age": 30 }
 * - Validation: Both fields are validated ✓
 * - Result: name and age are updated, role stays the same
 *
 * Example 3: Invalid data still gets rejected
 * - Request: PATCH /users/1 with body { "age": 10 }
 * - Validation: age fails (must be >= 13) ✗
 * - Result: Returns 400 Bad Request with error message
 *
 * Other mapped-types utilities:
 * - PickType(CreateUserDto, ['name', 'age']): Only includes specified fields
 * - OmitType(CreateUserDto, ['role']): Excludes specified fields
 * - IntersectionType(DtoA, DtoB): Combines two DTOs
 *
 * Package installation:
 * - Make sure @nestjs/mapped-types is installed:
 *   npm install @nestjs/mapped-types
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {
  // The class body is empty because PartialType handles everything
  // All the magic happens in the extends PartialType(CreateUserDto) part
}
