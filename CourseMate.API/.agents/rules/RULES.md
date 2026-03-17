# 🧱 CourseMate Architecture

## 📌 Overview

### Layers
- **API** – Presentation layer
- **Application** – Business logic & use cases
- **Contracts** – Shared DTOs, enums, constants
- **Infrastructure** – Database & external services
- **coursemate-ui** – Frontend

---

## ⚠️ General Rules
- Do not modify project references
- Do not change frontend (`coursemate-ui`)
- Do not add new libraries without approval
- Do not modify `DbContext` configuration

---

## 🧩 Layer Responsibilities

### 🔹 API
- Handle authentication & authorization
- Process HTTP requests/responses
- Call Application via MediatR
- No try-catch (handled by global exception)
- No business logic

---

### 🔹 Application
- Contains business logic
- Follows **CQRS pattern**
  - Command → write operations
  - Query → read operations
- Do not mix Command & Query responsibilities
- Command uses `CourseMateDbContext`
- Query uses `CourseMateReadOnlyDbContext`
- Can integrate with Admin Category API

---

### 🔹 Contracts
- Shared DTOs (Request/Response)
- Enums & constants across projects
- Input validation
- No business logic

---

### 🔹 Infrastructure
- Handles database & external services
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