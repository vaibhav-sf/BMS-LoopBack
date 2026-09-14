# 🚀 What We Will Implement

In this assignment, we will build a **Book Management REST API using LoopBack 4 and TypeScript**. The project will demonstrate both the core architecture and advanced features of LoopBack 4.

## 1. LoopBack 4 Application Setup

We will:

* Create a new LoopBack 4 application using the LoopBack CLI.
* Explore the generated project structure.
* Understand the purpose of models, repositories, controllers, data sources, and other application components.
* Run and test the application locally.

---

## 2. Book Management Domain

We will build a simple **Book Management System** consisting of two main entities:

### Author

The `Author` model will contain information such as:

* `id`
* `name`
* `email`

### Book

The `Book` model will contain information such as:

* `id`
* `title`
* `isbn`
* `price`
* `publishedYear`
* `authorId`

The relationship between the entities will be:

```text
Author
   │
   ├── Book
   ├── Book
   └── Book

One Author → Many Books
```

---

## 3. Models

We will create LoopBack models for:

* `Author`
* `Book`

The models will use LoopBack decorators such as:

```typescript
@model()
@property()
```

We will also define:

* Primary keys
* Property types
* Required properties
* Model metadata
* Relationships

---

## 4. Data Source

We will configure a LoopBack data source for storing application data.

The data source will demonstrate how LoopBack connects application models and repositories to a database.

Depending on the project setup, the application will use an appropriate database connector for development.

---

## 5. Repositories

We will create repositories for:

* `Author`
* `Book`

using LoopBack's:

```typescript
DefaultCrudRepository
```

Repositories will provide the data-access layer for the application.

We will use repository methods such as:

```text
create()
find()
findById()
updateById()
deleteById()
```

---

## 6. CRUD Operations

We will implement complete CRUD functionality for authors and books.

### Author APIs

```text
POST    /authors
GET     /authors
GET     /authors/{id}
PUT     /authors/{id}
DELETE  /authors/{id}
```

### Book APIs

```text
POST    /books
GET     /books
GET     /books/{id}
PUT     /books/{id}
DELETE  /books/{id}
```

The APIs will be implemented using LoopBack controller decorators such as:

```typescript
@get()
@post()
@put()
@del()
@param()
@requestBody()
```

---

## 7. Model Relationships

We will implement a **one-to-many relationship** between `Author` and `Book`.

```text
Author 1 ─────────── * Book
```

An author can have multiple books, while each book belongs to one author.

We will demonstrate LoopBack relationship decorators such as:

```typescript
@hasMany(() => Book)
```

and:

```typescript
@belongsTo(() => Author)
```

---

## 8. Dependency Injection

We will use LoopBack's Dependency Injection system to inject dependencies into controllers and other application components.

For example:

```typescript
@repository(BookRepository)
```

This will allow the controller to use the repository without manually creating repository objects.

---

## 9. IoC and Context

We will explore LoopBack's **Inversion of Control (IoC)** architecture and understand how the application context manages:

* Bindings
* Dependencies
* Object creation
* Component lifecycle
* Dependency resolution

We will also demonstrate creating and resolving a custom binding using LoopBack's context.

---

## 10. Custom Provider

We will create a custom **Provider** to demonstrate how reusable application logic can be registered and injected through LoopBack's Dependency Injection system.

The provider will perform custom application logic and will be consumed by another LoopBack component.

---

## 11. Custom Decorators / LoopBack Decorators

We will use LoopBack decorators to define metadata and configure application behavior.

The implementation will demonstrate decorators including:

```text
@model()
@property()
@get()
@post()
@put()
@del()
@param()
@requestBody()
@repository()
@hasMany()
@belongsTo()
```

---

## 12. Interceptor

We will implement a custom **logging interceptor**.

The interceptor will log method execution before and after a controller method runs.

Example output:

```text
Invoking method: BookController.create
Method completed: BookController.create
```

This will demonstrate how interceptors can be used for cross-cutting concerns such as:

* Logging
* Monitoring
* Performance tracking
* Request processing

---

## 13. Custom Component

We will create or configure a LoopBack **Component** to understand how reusable application functionality can be packaged and registered.

The component will demonstrate LoopBack's modular architecture and component-based extensibility.

---

## 14. API Documentation

We will use LoopBack's OpenAPI support to document and explore the REST APIs.

The API will be tested through the LoopBack API Explorer.

We will verify:

* Request parameters
* Request bodies
* Response data
* HTTP status codes
* CRUD operations
* Relationship-related functionality

---

## 15. Error Handling and Validation

We will add appropriate validation and error handling where required.

The application should correctly handle situations such as:

* Invalid input
* Missing required fields
* Non-existent author
* Non-existent book
* Invalid IDs
* Duplicate or invalid data where applicable

---

## 16. Testing the Application

We will test the implemented APIs and features to ensure that the application works correctly.

Testing will include:

```text
Create Author
      ↓
Create Book
      ↓
Assign Book to Author
      ↓
Retrieve Books
      ↓
Update Book
      ↓
Delete Book
```

We will also verify the logging interceptor, provider, relationships, and other advanced features.

---

# 🔀 Git and GitHub Workflow

The assignment will follow a proper Git workflow.

## Main Branch

The `main` branch will contain the stable version of the project.

## Assignment Branch

All implementation work will be performed on:

```text
13th-assignment
```

The workflow will be:

```text
main
  │
  └── 13th-assignment
          │
          ├── Application Setup
          ├── Models
          ├── Data Source
          ├── Repositories
          ├── Controllers
          ├── Relations
          ├── Provider
          ├── Interceptor
          ├── Component
          └── Testing
                    │
                    ▼
              Pull Request
                    │
                    ▼
               Code Review
                    │
                    ▼
              CI/CD Checks
                    │
                    ▼
                 main
```

---

# 🔒 Branch Protection

We will configure branch protection rules for the `main` branch.

The protected branch will require:

* Pull Request before merging
* At least one code review approval
* Successful status checks before merging
* No direct changes to `main` where applicable

This will ensure that changes are reviewed before becoming part of the stable branch.

---

# 👀 Code Review

The completed Assignment 13 implementation will be submitted through a Pull Request.

The code review process will include checking:

* Code quality
* Project structure
* API implementation
* Error handling
* Relationship implementation
* Dependency Injection
* Advanced LoopBack features
* Tests
* Documentation

---

# 📦 Final Deliverable

At the end of the assignment, the repository will contain a functional **LoopBack 4 Book Management API** demonstrating:

### Core LoopBack Concepts

* [x] LoopBack application
* [x] Models
* [x] Data source
* [x] Repositories
* [x] Controllers
* [x] CRUD operations
* [x] Model relationships
* [x] Dependency Injection
* [x] IoC and Context

### Advanced LoopBack Concepts

* [x] Providers
* [x] Decorators
* [x] Components
* [x] Interceptors

### Development Workflow

* [x] Git branching
* [x] Pull Request
* [x] Code review
* [x] Branch protection
* [x] CI/CD checks
* [x] Project documentation

---

# 🎯 Expected Result

The final project will demonstrate how **LoopBack 4 can be used with TypeScript to build a modular, scalable, and maintainable REST API**.

The project will follow a layered architecture:

```text
                 Client
                    │
                    ▼
              Controllers
                    │
                    ▼
              Repositories
                    │
                    ▼
               Data Source
                    │
                    ▼
                 Database
```

with LoopBack's **Dependency Injection, IoC, Context, Providers, Components, Decorators, and Interceptors** working across the application.
