# Authentication & Authorization Requirements

## 1. Objective

Build authentication and authorization features for the digital learning platform.

The system must support:

- Account login.
- Account registration.
- Login with Google.
- Registration with Google.
- Email verification after registration.
- Forgot password.
- Reset password.
- Role selection during login.
- Sending emails using HTML templates. (D:\projects\CourseMate\CourseMate.Application\EmailTemplates)
- Sending emails through background jobs.
- All forms must use Vietnamese.

---

## 2. Role Requirements

The system must support multiple user roles.

Proposed roles:

| Role | Description |
|---|---|
| Admin | System administrator |
| Teacher | Teacher |
| Student | Student |
| Parent | Parent |

Requirements:

- A user can have one or multiple roles.
- If the user has only one role, the system logs the user in directly with that role.
- If the user has multiple roles, the system must display a role selection screen after login.
- The login token must contain the user’s current role.
- The user can only select a role that belongs to their account.

---

## 3. Login Requirements

### 3.1 Login with Username/Password

The system must have a login form including:

- Username or email.
- Password.
- Login button.
- Login with Google button.
- Forgot password link.
- Register account link.

Processing requirements:

- Users can log in using either username or email.
- The system verifies the login credentials.
- If the credentials are incorrect, an error message must be displayed in Vietnamese.
- If the account has not verified its email, login is not allowed.
- If the account is locked, login is not allowed.
- If login is successful, the system returns a login token.
- If the user has multiple roles, the system requires role selection before entering the system.

Required Vietnamese messages:

```text
Vui lòng nhập tên đăng nhập hoặc email.
Vui lòng nhập mật khẩu.
Thông tin đăng nhập không chính xác.
Tài khoản chưa xác thực email.
Tài khoản đã bị khóa.
Đăng nhập thành công.