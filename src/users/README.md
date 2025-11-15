# Users Module - Complete CRUD API Guide

This folder contains a complete example of a CRUD (Create, Read, Update, Delete) REST API built with Nest.js. This README will help you understand how all the pieces work together.

## Table of Contents
- [What is This Module?](#what-is-this-module)
- [File Structure](#file-structure)
- [Architecture Overview](#architecture-overview)
- [How Data Flows](#how-data-flows)
- [API Endpoints](#api-endpoints)
- [Understanding Each File](#understanding-each-file)
- [Try It Yourself](#try-it-yourself)

---

## What is This Module?

The **Users Module** is a self-contained feature that manages user data. It demonstrates:
- ✅ RESTful API design
- ✅ Dependency injection
- ✅ Input validation
- ✅ Error handling
- ✅ Separation of concerns (Controller, Service, DTO)

---

## File Structure

```
src/users/
├── dto/
│   ├── create-user.dto.ts      # Validation rules for creating users
│   └── update-user.dto.ts      # Validation rules for updating users
├── users.controller.ts         # HTTP endpoints (routes)
├── users.service.ts            # Business logic & data management
├── users.module.ts             # Module definition
├── users.http                  # HTTP request examples
├── users.controller.spec.ts    # Controller tests
└── users.service.spec.ts       # Service tests
```

---

## Architecture Overview

The users module follows a **layered architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                        users.module.ts                       │
│                    (Organizes everything)                    │
│                                                              │
│  ┌────────────────────────────┐  ┌─────────────────────┐   │
│  │   users.controller.ts      │  │  users.service.ts   │   │
│  │   (HTTP Layer)             │─▶│  (Business Logic)   │   │
│  │                            │  │                     │   │
│  │  - Routes                  │  │  - CRUD operations  │   │
│  │  - Request/Response        │  │  - Data storage     │   │
│  │  - Validation triggers     │  │  - Error handling   │   │
│  └────────────────────────────┘  └─────────────────────┘   │
│              │                                               │
│              │ uses                                          │
│              ▼                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │              dto/ (Data Transfer Objects)          │     │
│  │  ┌──────────────────────┐  ┌──────────────────┐   │     │
│  │  │ create-user.dto.ts   │  │ update-user.dto  │   │     │
│  │  │ (New user rules)     │  │ (Update rules)   │   │     │
│  │  └──────────────────────┘  └──────────────────┘   │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### The Three Layers

| Layer | File | Responsibility |
|-------|------|----------------|
| **HTTP Layer** | `users.controller.ts` | Handles HTTP requests, calls service methods |
| **Business Logic** | `users.service.ts` | Contains CRUD logic, manages data |
| **Validation** | `dto/*.ts` | Defines data structure and validation rules |
| **Module** | `users.module.ts` | Wires everything together |

---

## How Data Flows

### Example: Creating a New User

Let's trace what happens when you send: `POST /users` with body `{"name":"Alice","age":20,"role":"STUDENT"}`

```
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 1: Request arrives at Nest.js                                  │
├─────────────────────────────────────────────────────────────────────┤
│ POST http://localhost:3000/users                                    │
│ Content-Type: application/json                                      │
│                                                                      │
│ {                                                                    │
│   "name": "Alice",                                                   │
│   "age": 20,                                                         │
│   "role": "STUDENT"                                                  │
│ }                                                                    │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 2: Global ValidationPipe validates data                        │
├─────────────────────────────────────────────────────────────────────┤
│ • Transforms JSON into CreateUserDto instance                       │
│ • Checks: Is name a string? ✓                                       │
│ • Checks: Is name.length >= 1? ✓                                    │
│ • Checks: Is age a number? ✓                                        │
│ • Checks: Is age >= 13? ✓                                           │
│ • Checks: Is role one of TEACHER/STUDENT/ADMIN? ✓                   │
│                                                                      │
│ Result: ✓ All validations passed                                    │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 3: Router finds matching endpoint                              │
├─────────────────────────────────────────────────────────────────────┤
│ • Method: POST                                                       │
│ • Route: /users                                                      │
│ • Handler: UsersController.createUser()                             │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 4: Controller receives the request                             │
├─────────────────────────────────────────────────────────────────────┤
│ users.controller.ts:                                                │
│                                                                      │
│   @Post()                                                            │
│   createUser(@Body() createUserDto: CreateUserDto) {                │
│     return this.usersService.createUser(createUserDto);             │
│   }                                                                  │
│                                                                      │
│ • @Body() extracts the validated DTO                                │
│ • Controller delegates to the service                               │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 5: Service processes the business logic                        │
├─────────────────────────────────────────────────────────────────────┤
│ users.service.ts:                                                   │
│                                                                      │
│   createUser(createUserDto: CreateUserDto) {                        │
│     // Find the highest ID                                          │
│     const maxId = Math.max(...this.users.map(u => u.id));           │
│     // maxId = 3                                                     │
│                                                                      │
│     // Create new user with ID 4                                    │
│     const newUser = { id: 4, ...createUserDto };                    │
│     // newUser = { id: 4, name: "Alice", age: 20, role: "STUDENT" } │
│                                                                      │
│     // Add to array                                                 │
│     this.users.push(newUser);                                       │
│                                                                      │
│     // Return the new user                                          │
│     return newUser;                                                 │
│   }                                                                  │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 6: Response flows back to client                               │
├─────────────────────────────────────────────────────────────────────┤
│ Service → Controller → Nest.js → Client                             │
│                                                                      │
│ HTTP/1.1 201 Created                                                 │
│ Content-Type: application/json                                      │
│                                                                      │
│ {                                                                    │
│   "id": 4,                                                           │
│   "name": "Alice",                                                   │
│   "age": 20,                                                         │
│   "role": "STUDENT"                                                  │
│ }                                                                    │
└─────────────────────────────────────────────────────────────────────┘
```

**Key Takeaways:**
1. **Validation happens automatically** before reaching your controller
2. **Controller is thin** - it just delegates to the service
3. **Service contains the logic** - creates ID, adds to array, returns user
4. **Nest handles serialization** - converts object to JSON automatically

---

## API Endpoints

This module exposes 5 RESTful endpoints:

### 1. Get All Users
```http
GET /users
```
**Response:** Array of all users
```json
[
  { "id": 1, "name": "Tyler", "age": 26, "role": "TEACHER" },
  { "id": 2, "name": "John", "age": 33, "role": "STUDENT" },
  { "id": 3, "name": "Stan", "age": 50, "role": "ADMIN" }
]
```

### 2. Get Single User
```http
GET /users/:id
```
**Example:** `GET /users/1`
**Response:** Single user object
```json
{ "id": 1, "name": "Tyler", "age": 26, "role": "TEACHER" }
```

### 3. Create User
```http
POST /users
Content-Type: application/json

{
  "name": "Alice",
  "age": 22,
  "role": "STUDENT"
}
```
**Response:** Newly created user with auto-generated ID
```json
{ "id": 4, "name": "Alice", "age": 22, "role": "STUDENT" }
```

**Validation Rules:**
- `name`: Must be a string, minimum length 1
- `age`: Must be a number, minimum value 13
- `role`: Must be exactly "TEACHER", "STUDENT", or "ADMIN"

### 4. Update User
```http
PATCH /users/:id
Content-Type: application/json

{
  "age": 27
}
```
**Example:** `PATCH /users/1` with body `{"age": 27}`
**Response:** Updated user object
```json
{ "id": 1, "name": "Tyler", "age": 27, "role": "TEACHER" }
```

**Note:** All fields are optional - you can update just `name`, just `age`, or multiple fields.

### 5. Delete User
```http
DELETE /users/:id
```
**Example:** `DELETE /users/2`
**Response:** No content (void)

---

## Understanding Each File

### 📄 users.module.ts - The Organizer

**What it does:** Tells Nest.js about the controller and service

```typescript
@Module({
  controllers: [UsersController],  // Register HTTP handlers
  providers: [UsersService],       // Register injectable services
})
```

**Key concepts:**
- Every feature should have its own module
- Modules can import other modules
- Nest uses modules to build the dependency injection tree

---

### 📄 users.controller.ts - The HTTP Layer

**What it does:** Defines API endpoints and handles HTTP requests

**Key decorators used:**

| Decorator | Purpose | Example |
|-----------|---------|---------|
| `@Controller('users')` | Sets base route | All routes start with `/users` |
| `@Get()` | Handle GET requests | Read operations |
| `@Post()` | Handle POST requests | Create operations |
| `@Patch()` | Handle PATCH requests | Update operations |
| `@Delete()` | Handle DELETE requests | Delete operations |
| `@Param('id')` | Extract route parameter | Get `:id` from `/users/:id` |
| `@Body()` | Extract request body | Get JSON payload |
| `ParseIntPipe` | Convert string to number | Validates and transforms |

**Pattern: Dependency Injection**
```typescript
constructor(private usersService: UsersService) {}
```
- Nest automatically creates and provides `UsersService`
- The `private` keyword creates a class property
- You can use `this.usersService` throughout the controller

---

### 📄 users.service.ts - The Business Logic

**What it does:** Contains CRUD operations and manages data

**Key features:**

1. **@Injectable() decorator**
   - Marks this class as a provider
   - Allows it to be injected into controllers

2. **In-memory data storage**
   ```typescript
   private users: User[] = [...]
   ```
   - Stores users in an array (in real apps, this would be a database)
   - `private` means only this class can access it

3. **CRUD methods:**
   - `getUsers()` - Returns all users
   - `getUser(id)` - Finds user by ID
   - `createUser(dto)` - Creates new user with auto-increment ID
   - `updateUser(id, dto)` - Updates specific fields
   - `deleteUser(id)` - Removes user from array

4. **Error handling:**
   ```typescript
   throw new NotFoundException('user with that id not found');
   ```
   - Nest automatically converts this to HTTP 404 response

---

### 📄 dto/create-user.dto.ts - Validation Rules for Creating

**What it does:** Defines what fields are required and their validation rules

**Validation decorators explained:**

```typescript
@IsString()           // Must be a string type
@MinLength(1)         // Must have at least 1 character
name: string;

@IsNumber()           // Must be a number type
@Min(13)              // Must be >= 13
age: number;

@IsEnum(['TEACHER', 'STUDENT', 'ADMIN'])  // Must be one of these exact values
role: 'TEACHER' | 'STUDENT' | 'ADMIN';
```

**How it works:**
1. Global `ValidationPipe` in `main.ts` enables automatic validation
2. When a request comes in, Nest checks the data against these rules
3. If validation fails → Returns 400 Bad Request with error details
4. If validation passes → Controller method receives the valid data

**Example error response** (if you send `age: 10`):
```json
{
  "statusCode": 400,
  "message": ["age must not be less than 13"],
  "error": "Bad Request"
}
```

---

### 📄 dto/update-user.dto.ts - Validation Rules for Updating

**What it does:** Makes all CreateUserDto fields optional

```typescript
export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

**Magic of PartialType:**
- Takes `CreateUserDto` and makes all fields optional
- Keeps all the validation rules (if you provide `age`, it must be >= 13)
- No code duplication!

**Equivalent to writing:**
```typescript
export class UpdateUserDto {
  @IsString()
  @MinLength(1)
  @IsOptional()
  name?: string;

  @IsNumber()
  @Min(13)
  @IsOptional()
  age?: number;

  @IsEnum(['TEACHER', 'STUDENT', 'ADMIN'])
  @IsOptional()
  role?: 'TEACHER' | 'STUDENT' | 'ADMIN';
}
```

But much cleaner!

---

### 📄 users.http - Test Your API

**What it does:** Provides ready-to-run HTTP requests

**How to use:**

**In WebStorm/IntelliJ IDEA:**
- Click the green ▶ icon next to any request

**In VS Code:**
- Install "REST Client" extension
- Click "Send Request" above each request

**Example requests in the file:**
```http
### Get all users
GET localhost:3000/users

### Get user by ID
GET localhost:3000/users/1

### Create a new user
POST localhost:3000/users
Content-Type: application/json

{
  "name": "Carl",
  "age": 55,
  "role": "ADMIN"
}
```

---

## Try It Yourself

### Exercise 1: Test All Endpoints
1. Start the server: `npm run start:dev`
2. Open `users.http`
3. Run each request and observe the responses
4. Try to break the validation:
   - Send `age: 10` (too young)
   - Send `role: "INVALID"` (not in enum)
   - Send `name: ""` (too short)

### Exercise 2: Trace a Request
Pick one endpoint and trace through the code:
1. Find the controller method
2. See what service method it calls
3. Look at the DTO used for validation
4. Predict the response

### Exercise 3: Modify the Code
Try making these changes:
1. Add a new field `email` to the User interface
2. Update CreateUserDto with email validation (`@IsEmail()`)
3. Modify the initial users array to include emails
4. Test with the .http file

### Exercise 4: Create Your Own Module
Now create a `todos` module following the same pattern:
- Todo should have: `id`, `title`, `description`, `completed`
- Implement all 5 CRUD endpoints
- Add proper validation

**Hint:** Use `nest g resource todos` to generate the boilerplate!

---

## Summary

You've learned:
- ✅ How modules organize code
- ✅ How controllers handle HTTP requests
- ✅ How services contain business logic
- ✅ How DTOs validate incoming data
- ✅ How dependency injection connects it all
- ✅ How to trace a request through all layers

**Next Step:** Apply this pattern to create your own CRUD API for todos!

Good luck!
