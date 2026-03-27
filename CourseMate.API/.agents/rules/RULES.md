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

### API
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

### Application
- Contains business logic
- Follows **CQRS pattern**
  - Command → write operations
  - Query → read operations
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

### Contracts
- Shared DTOs (Request/Response)
- DTO must be POCO classes (no inheritance, no logic)
- Enums & constants across projects
- Input validation
- No business logic
- Command, Query must be simple POCO classes (no inheritance, no business logic, no constructors)
- Each use case should have its own Command, Query, and DTO (avoid reuse across handlers)
- DTOs must follow naming convention per use case:
  - Query DTO: GetList[Entities]Query, GetById[Entity]Query
  - Command DTO: Create[Entity]Command, Update[Entity]Command, Delete[Entity]Command
---

### Persistent
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