# Getting Started with Nest.js

Welcome to your first Nest.js project! This guide will walk you through everything you need to know to understand and recreate this project.

## Table of Contents
- [What is Nest.js?](#what-is-nestjs)
- [Installation & Setup](#installation--setup)
- [Project Structure](#project-structure)
- [Core Nest.js Concepts](#core-nestjs-concepts)
- [How a Request Flows Through the App](#how-a-request-flows-through-the-app)
- [CLI Commands Reference](#cli-commands-reference)
- [Running the Project](#running-the-project)
- [Testing Your API](#testing-your-api)

---

## What is Nest.js?

Nest.js is a progressive Node.js framework for building efficient, reliable, and scalable server-side applications. It uses TypeScript by default and is heavily inspired by Angular's architecture.

**Key Features:**
- Built with TypeScript (but supports JavaScript too)
- Modular architecture for organizing code
- Built-in dependency injection
- Decorators for clean, declarative code
- Supports REST APIs, GraphQL, WebSockets, and more

---

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn package manager

### Creating a New Nest.js Project

1. **Install the Nest CLI globally:**
   ```bash
   npm install -g @nestjs/cli
   ```

2. **Create a new project:**
   ```bash
   # Create a new project in a new folder
   nest new my-project

   # Or create in the current directory
   nest new .
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Install validation packages** (used in this project):
   ```bash
   npm install class-validator class-transformer
   npm install @nestjs/mapped-types
   ```

---

## Project Structure

When you create a Nest.js project, you get the following structure:

```
nest-lesson/
├── src/
│   ├── app.module.ts       # Root module of the application
│   ├── app.controller.ts   # Root controller (can be deleted)
│   ├── app.service.ts      # Root service (can be deleted)
│   ├── main.ts             # Entry point - bootstraps the app
│   └── users/              # Users feature module
│       ├── dto/            # Data Transfer Objects (validation)
│       │   ├── create-user.dto.ts
│       │   └── update-user.dto.ts
│       ├── users.controller.ts    # HTTP endpoints
│       ├── users.service.ts       # Business logic
│       ├── users.module.ts        # Module definition
│       └── users.http             # HTTP request examples
├── test/                   # End-to-end tests
├── node_modules/           # Dependencies
├── package.json            # Project metadata & dependencies
├── tsconfig.json           # TypeScript configuration
└── nest-cli.json           # Nest CLI configuration
```

### What Each File Does

| File | Purpose |
|------|---------|
| `main.ts` | Entry point - creates the Nest application and starts the server |
| `*.module.ts` | Defines a module with its controllers and providers |
| `*.controller.ts` | Handles HTTP requests and returns responses |
| `*.service.ts` | Contains business logic and data manipulation |
| `*.dto.ts` | Defines data structure and validation rules |
| `*.http` | HTTP request examples for testing (JetBrains/VS Code) |

---

## Core Nest.js Concepts

### 1. Modules
Modules are the building blocks of a Nest.js application. Every app has at least one module (the root module).

**Purpose:** Organize related code together (controllers, services, etc.)

```typescript
@Module({
  controllers: [UsersController],  // HTTP endpoints
  providers: [UsersService],       // Injectable services
})
export class UsersModule {}
```

### 2. Controllers
Controllers handle incoming HTTP requests and return responses to the client.

**Purpose:** Define API endpoints and route HTTP requests

```typescript
@Controller('users')  // Base route: /users
export class UsersController {
  @Get()              // GET /users
  findAll() {
    return 'This returns all users';
  }

  @Get(':id')         // GET /users/:id
  findOne(@Param('id') id: string) {
    return `This returns user #${id}`;
  }
}
```

### 3. Services (Providers)
Services contain business logic and are designed to be reused across the application.

**Purpose:** Separate business logic from HTTP layer

```typescript
@Injectable()  // Makes it injectable via dependency injection
export class UsersService {
  private users = [];

  findAll() {
    return this.users;
  }
}
```

### 4. Dependency Injection (DI)
Nest.js has a built-in dependency injection system. Instead of creating instances manually, Nest provides them automatically.

```typescript
@Controller('users')
export class UsersController {
  // Nest automatically creates UsersService and injects it here
  constructor(private usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();  // Use the injected service
  }
}
```

**Why DI is useful:**
- Reduces coupling between classes
- Makes testing easier (you can inject mock services)
- Nest manages the lifecycle of instances

### 5. DTOs (Data Transfer Objects)
DTOs define the shape of data and validation rules for requests.

**Purpose:** Validate incoming data automatically

```typescript
export class CreateUserDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsNumber()
  @Min(13)
  age: number;
}
```

### 6. Pipes
Pipes transform or validate data. Common pipes include:
- `ValidationPipe` - Validates request data against DTOs
- `ParseIntPipe` - Converts string to integer

```typescript
// Global validation (in main.ts)
app.useGlobalPipes(new ValidationPipe());

// Parameter validation
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  // id is guaranteed to be a number
}
```

---

## How a Request Flows Through the App

Here's a visual representation of what happens when a client makes a request:

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser/Postman)                     │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTP Request
                            │ POST /users
                            │ { "name": "John", "age": 25, "role": "STUDENT" }
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                         NEST.JS APP                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  1. GLOBAL PIPES (main.ts)                                │  │
│  │     - ValidationPipe validates request body               │  │
│  │     - Transforms JSON to DTO instance                     │  │
│  │     - Returns 400 error if validation fails               │  │
│  └──────────────────────┬────────────────────────────────────┘  │
│                         │ ✓ Validation passed                   │
│                         ▼                                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  2. ROUTER                                                │  │
│  │     - Finds matching route: POST /users                   │  │
│  │     - Identifies controller method to call                │  │
│  └──────────────────────┬────────────────────────────────────┘  │
│                         │                                         │
│                         ▼                                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  3. CONTROLLER (users.controller.ts)                      │  │
│  │     - @Post() createUser() method is called               │  │
│  │     - @Body() extracts validated CreateUserDto            │  │
│  │     - Delegates to service                                │  │
│  │                                                            │  │
│  │     @Post()                                                │  │
│  │     createUser(@Body() dto: CreateUserDto) {              │  │
│  │       return this.usersService.createUser(dto);           │  │
│  │     }                                                      │  │
│  └──────────────────────┬────────────────────────────────────┘  │
│                         │                                         │
│                         ▼                                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  4. SERVICE (users.service.ts)                            │  │
│  │     - Contains business logic                             │  │
│  │     - Creates new user with auto-incremented ID           │  │
│  │     - Adds to in-memory array                             │  │
│  │     - Returns the new user object                         │  │
│  │                                                            │  │
│  │     createUser(dto: CreateUserDto) {                      │  │
│  │       const newUser = { id: maxId + 1, ...dto };          │  │
│  │       this.users.push(newUser);                           │  │
│  │       return newUser;                                     │  │
│  │     }                                                      │  │
│  └──────────────────────┬────────────────────────────────────┘  │
│                         │                                         │
│                         │ Returns new user                        │
│                         ▼                                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  CONTROLLER → CLIENT                                       │  │
│  │     - Nest automatically serializes response to JSON       │  │
│  │     - Sets HTTP status code (201 for POST)                │  │
│  └───────────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTP Response
                            │ 201 Created
                            │ { "id": 4, "name": "John", "age": 25, "role": "STUDENT" }
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser/Postman)                     │
└─────────────────────────────────────────────────────────────────┘
```

### Step-by-Step Breakdown

1. **Client sends request** → POST /users with JSON body
2. **ValidationPipe checks data** → Validates against CreateUserDto
3. **Router finds handler** → Matches POST /users to controller method
4. **Controller receives request** → @Body() gives validated DTO
5. **Service processes logic** → Creates user, adds to array
6. **Response returns** → Service → Controller → Client

---

## CLI Commands Reference

The Nest CLI helps you generate code quickly and consistently.

### Generate a Complete Module (Controller + Service + Module)

```bash
# Generate everything at once
nest g resource todos

# You'll be prompted to choose:
# - REST API
# - Generate CRUD entry points? Yes
```

### Generate Individual Components

```bash
# Generate a module
nest g module users

# Generate a controller
nest g controller users

# Generate a service
nest g service users

# Generate a class (like a DTO)
nest g class users/dto/create-user.dto --no-spec
```

### Command Options

| Option | Description | Example |
|--------|-------------|---------|
| `--no-spec` | Don't generate test file | `nest g service users --no-spec` |
| `--flat` | Don't create a folder | `nest g controller users --flat` |
| `--dry-run` | Preview without creating | `nest g module users --dry-run` |

### Common Generators

| Command | Shorthand | Generates |
|---------|-----------|-----------|
| `nest generate module` | `nest g mo` | Module |
| `nest generate controller` | `nest g co` | Controller |
| `nest generate service` | `nest g s` | Service |
| `nest generate class` | `nest g cl` | Class |
| `nest generate interface` | `nest g i` | Interface |

---

## Running the Project

### Development Mode (with auto-reload)
```bash
npm run start:dev
```
This watches for file changes and automatically restarts the server.

### Production Mode
```bash
npm run build
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```
Enables debugging with inspector on port 9229.

### The server runs on:
```
http://localhost:3000
```

---

## Testing Your API

### Using the .http File (Recommended for this project)

This project includes `src/users/users.http` with ready-to-run requests.

**In WebStorm/IntelliJ:**
- Click the green ▶ icon next to each request

**In VS Code:**
- Install "REST Client" extension
- Click "Send Request" above each request

### Using cURL

```bash
# Get all users
curl http://localhost:3000/users

# Get user by ID
curl http://localhost:3000/users/1

# Create a user
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John","age":25,"role":"STUDENT"}'

# Update a user
curl -X PATCH http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"age":26}'

# Delete a user
curl -X DELETE http://localhost:3000/users/1
```

### Using Postman

1. Create a new request
2. Set method (GET, POST, PATCH, DELETE)
3. Enter URL: `http://localhost:3000/users`
4. For POST/PATCH: Add JSON body in "Body" → "raw" → "JSON"

---

## Next Steps

Now that you understand the basics, explore the `src/users/` folder to see a complete CRUD API implementation. Check out:

1. **src/users/README.md** - Detailed explanation of the users module
2. Code files with inline comments explaining each concept
3. Try creating your own module (like `todos`) following the same pattern!

### Homework Challenge

Create a `todos` CRUD API in the `src/todos/` folder that includes:
- Todo entity with: `id`, `title`, `description`, `completed` (boolean)
- All CRUD operations (Create, Read, Update, Delete)
- Validation using DTOs
- Proper use of modules, controllers, and services

Good luck and happy coding!
