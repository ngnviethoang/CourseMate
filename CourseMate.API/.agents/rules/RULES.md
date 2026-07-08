---
trigger: always_on
---

# CourseMate Architecture

## Overview

### Layers
- **API** – Presentation layer
- **Application** – Business logic & use cases
- **Contracts** – Shared DTOs, enums, constants
- **Persistent** – Database
- **coursemate-ui** – Frontend

---

## General Rules
- Do not modify project references
- Do not change frontend (`coursemate-ui`)
- Do not add new libraries without approval
- Do not modify `DbContext` configuration
- Do not pass UserId from Controller, use IHttpContextAccessor to get UserId from the current request context in handler
---

## Layer Responsibilities

### CourseMate.API
- Handle authentication & authorization
- Process HTTP requests/responses
- Call Application via MediatR
- No try-catch (handled by global exception)
- No business logic
- Controller methods must follow naming convention:
  - GetList[Entities]Async
  - GetById[Entity]Async
  - Create[Entity]Async
  - Update[Entity]Async
  - Delete[Entity]Async
- Controllers must only return success responses:
  - Ok() for data
  - NoContent() for no data
---

### CourseMate.Application
- Contains business logic
- Follows **CQRS pattern**
  - Command → write operations
  - Query → read operations
- In class handler contains Command or Query DTO. Other response DTO will be created in Contracts project
- Command, Query class must be
  + Input validation
  + Simple POCO classes (no inheritance, no business logic, no constructors)
  + Each use case should have its own Command, Query, 
  + Follow naming convention per use case:
    * Query DTO: GetList[Entities]Query, GetById[Entity]Query
    * Command DTO: Create[Entity]Command, Update[Entity]Command, Delete[Entity]Command
  + Each class handler should handle only one Command or Query. It must not contain public DTOs or other handlers.

- Do not mix Command & Query responsibilities
- Command uses `CourseMateDbContext`
- Query uses `CourseMateReadOnlyDbContext`
- Can integrate with Admin Category API
- In Command, Query: must throw `BusinessException`, not generic exceptions
- Do not hardcode error messages; use Exception Constants
- Query must not throw exceptions
- Always return safe defaults (empty list or null)
- Handlers must follow the same naming convention per use case:
  - Query: GetList[Entities]QueryHandler, GetById[Entity]QueryHandler
  - Command: Create[Entity]CommandHandler, Update[Entity]CommandHandler, Delete[Entity]CommandHandler
- Null → throw `EntityNotFoundException`
- Command can throw | Query must not throw
- Do not use `SaveChangesAsync()` (handled by TransactionPipelineBehavior)
- Use `AddAsync`, `AddRangeAsync` (no sync methods)
- No N+1 queries (no queries inside loops)
- Do not use anonymous types in queries → use `private sealed record` inside Handler
- Use `EF.Functions.ILike(...)` instead of `Contains(...)` for filtering (PostgreSQL, case-insensitive)
  Do not use `DbContext.[Entities].AsQueryable()`
---


### CourseMate.Application.Tests
- Test only handlers in CourseMate.Application (CommandHandler, QueryHandler).
- Do not test controllers or middleware here.
- Put tests in Commands/<Feature>/<HandlerName>Tests.cs or Queries/<Feature>/<HandlerName>Tests.cs.
- Use method name format: Handle_Should<Expected>_When<Condition>.
- Follow Arrange - Act - Assert.
- Always use TestInfrastructure/TestDbContextScope.cs.
- Each test file must have private readonly TestContainer _testContainer = new();.
- TestContainer must be a private sealed class inside the same *Tests.cs file.
- TestContainer constructor must create context from TestDbContextScope(UserId, Roles.Admin).
- TestContainer constructor must seed test data directly.
- Do not create seed helper methods like SeedCategoryAsync(...), SeedCourseAsync(...).
- Use CreateWriteDbContext() for command tests.
- Use CreateReadOnlyDbContext() for query tests.
- Tests use EF Core InMemory.
- TestDbContextScope ignores FileEntryEmbedding to avoid pgvector Vector mapping issues.
- For commands: call SaveChangesAsync() when checking persisted data.
- Validate exact exception type for error paths (BusinessException, EntityNotFoundException, etc.).
- If BusinessException, also assert ErrorCode.
- For list queries, cover filter, sorting, and pagination.
- Assertions must match seeded data (example: HasCourse = true can return multiple items if constructor seeded multiple categories with courses).
- Each test must be independent.
- Do not share mutable state between tests.
- Category references for writing new tests:
- Commands/Categories/CreateCategoryCommandHandlerTests.cs
- Commands/Categories/UpdateCategoryCommandHandlerTests.cs
- Commands/Categories/DeleteCategoryCommandHandlerTests.cs
- Queries/Categories/GetCategoryByIdQueryHandlerTests.cs
- Queries/Categories/GetListCategoriesQueryHandlerTests.cs
---

### CourseMate.Contracts
- Shared DTOs (Response), reuse across handlers
- DTO must be POCO classes (no inheritance, no logic)
- Enums & constants across projects
- No business logic
---

### CourseMate.Persistent
- Handles database
- No business logic
- Contains:
  - Entities
  - Entity configurations
- Only use `MaxLength` in entity config
- Other configurations must use Fluent API
- When adding a new Entity:
  - Must add to `DbContext`
  - Must add to `ReadOnlyDbContext`
- Do not modify DB tuning/configuration
- Write Db configuration in a single line
- Use plural names for table mapping
- Do not use navigation properties or store JSON directly in the database.
- Refer to CourseConfiguration.cs when configuring new entities