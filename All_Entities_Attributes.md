# BẢNG THUỘC TÍNH ĐẦY ĐỦ - TẤT CẢ ENTITIES
## Hệ thống CourseMate

---

## NHÓM 1: XÁC THỰC VÀ NGƯỜI DÙNG

### USER
```
USER (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
      UserName, Email, NormalizedUserName, NormalizedEmail, EmailConfirmed,
      PasswordHash, SecurityStamp, ConcurrencyStamp, PhoneNumber, PhoneNumberConfirmed,
      TwoFactorEnabled, LockoutEnd, LockoutEnabled, AccessFailedCount, IsApproved)
```

---

## NHÓM 2: CẤU TRÚC KHÓA HỌC

### CATEGORY
```
CATEGORY (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
          Name, Description, IsActive)
```

### COURSE
```
COURSE (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
        Title, Description, Price, ImageUrl, IsPublished, CategoryId, InstructorId)
```

### CHAPTER
```
CHAPTER (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
         CourseId, Title, Position)
```

### LESSON
```
LESSON (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
        ChapterId, CourseId, Title, LessonType, Position)
```

### LESSON_VIDEO
```
LESSON_VIDEO (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
              LessonId, VideoUrl)
```

### LESSON_READING
```
LESSON_READING (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
                LessonId, Content)
```

### LESSON_QUIZ
```
LESSON_QUIZ (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
             LessonId, Description, PassingScore)
```

### LESSON_QUIZ_QUESTION
```
LESSON_QUIZ_QUESTION (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
                      LessonQuizId, Text, Position)
```

### LESSON_QUIZ_ANSWER
```
LESSON_QUIZ_ANSWER (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
                    LessonQuizQuestionId, Text, IsCorrect, Position)
```

### LESSON_CODING
```
LESSON_CODING (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
               LessonId, ExerciseId)
```

### LESSON_MATERIAL
```
LESSON_MATERIAL (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
                 LessonId, Outline, DocumentFileId, Status)
```

### USER_LESSON_PROGRESS
```
USER_LESSON_PROGRESS (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
                      StudentId, LessonId, IsCompleted, Score)
```

### REVIEW
```
REVIEW (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
        CourseId, StudentId, Rating, Comment)
```

---

## NHÓM 3: ĐĂNG KÝ VÀ TIẾN ĐỘ HỌC TẬP

### ENROLLMENT
```
ENROLLMENT (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
            StudentId, CourseId)
```

---

## NHÓM 4: HỆ THỐNG BÀI TẬP LẬP TRÌNH

### EXERCISE
```
EXERCISE (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
          Title, Description, Difficulty, Category, CreatorId, Constraints, Hints, IsHidden)
```

### EXERCISE_SUBMISSION
```
EXERCISE_SUBMISSION (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
                     ExerciseId, Language, Code, IsPassed, Score, TotalTime, TotalMemory)
```

### EXERCISE_TEST_CASE
```
EXERCISE_TEST_CASE (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
                    ExerciseId, Input, ExpectedOutput, Description, IsHidden, Order)
```

### EXERCISE_EXAMPLE
```
EXERCISE_EXAMPLE (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
                  ExerciseId, Input, Output, Explanation)
```

### EXERCISE_DEFAULT_CODE
```
EXERCISE_DEFAULT_CODE (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
                       ExerciseId, Language, StarterCode)
```

---

## NHÓM 5: HỆ THỐNG CUỘC THI LẬP TRÌNH

### CONTEST
```
CONTEST (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
         Title, Description, Status, StartTime, EndTime, DurationInMinutes,
         AllowedLanguages, MemoryLimit, TimeLimit, AntiCheatLevel, CreatorId, MaxViolations)
```

### CONTEST_REGISTRATION
```
CONTEST_REGISTRATION (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
                     ContestId, StudentId, RegistrationTime, JoinTime, SubmitTime,
                     IsDisqualified, ViolationCount, DisqualifiedAt, DisqualifiedReason)
```

### CONTEST_SUBMISSION
```
CONTEST_SUBMISSION (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
                    ContestId, ExerciseId, StudentId, Language, Code, Score,
                    TotalTime, TotalMemory, CreationTime, IsFinal)
```

### CONTEST_EXERCISE
```
CONTEST_EXERCISE (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
                  ContestId, ExerciseId, ScoreWeight, Order)
```

### CONTEST_PRIZE
```
CONTEST_PRIZE (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
               ContestId, CourseId, MinRank, MaxRank)
```

### ANTI_CHEAT_VIOLATION
```
ANTI_CHEAT_VIOLATION (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
                      ContestId, StudentId, ViolationType, Details, OccurredAt)
```

---

## NHÓM 6: ĐƠN HÀNG VÀ THANH TOÁN

### CART
```
CART (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
      StudentId)
```

### CART_ITEM
```
CART_ITEM (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
           CartId, CourseId)
```

### ORDER
```
ORDER (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
       StudentId, TotalAmount, Status, Description)
```

### ORDER_ITEM
```
ORDER_ITEM (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
            OrderId, CourseId, Price)
```

### PAYMENT_TRANSACTION
```
PAYMENT_TRANSACTION (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
                    OrderId, Status, Currency, Amount, Provider, TransactionId,
                    RawRequest, RawResponse, FailReason)
```

---

## NHÓM 7: HỆ THỐNG GỢI Ý (RECOMMENDATION)

### STUDENT_PREFERENCE
```
STUDENT_PREFERENCE (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
                    StudentId, FavouriteCategories, PreferredDifficulty, LearningGoal,
                    MinutesPerDay, SkillLevel, RecommendContests, RecommendExercises, AutoRefresh)
```

### STUDENT_SKILL_PROFILE
```
STUDENT_SKILL_PROFILE (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
                      StudentId, Category, Difficulty, TotalAttempts, PassedAttempts,
                      AverageScore, AverageRuntime, MasteryScore, IsWeakArea, LastAttemptedAt)
```

### RECOMMENDATION_LOG
```
RECOMMENDATION_LOG (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
                    StudentId, RecommendationType, Strategy, ResultCount, Payload, TopScore)
```

### RECOMMENDATION_ANALYTICS
```
RECOMMENDATION_ANALYTICS (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
                           StudentId, CourseId, EnrollmentId, ContentScore, CollaborativeScore,
                           WeaknessScore, PopularityScore, FinalScore, Source, Feedback,
                           FeedbackTime, EnrolledAt, IsCompleted, CompletedAt)
```

### COURSE_EMBEDDING
```
COURSE_EMBEDDING (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
                  CourseId, SourceText, Dimensions, Embedding)
```

---

## NHÓM 8: HỆ THỐNG VÀ HỖ TRỢ

### NOTIFICATION
```
NOTIFICATION (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
              ReceiverId, Title, Message, IsRead)
```

### FILE_ENTRY
```
FILE_ENTRY (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
            FileName, FileSize, FileLocation, Status, TotalChunks, UploadedChunks,
            CompletedAt, FileType)
```

### FILE_CHUNK
```
FILE_CHUNK (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
            FileEntryId, ChunkIndex, ChunkLocation, ChunkSize, IsUploaded)
```

### FILE_ENTRY_EMBEDDING
```
FILE_ENTRY_EMBEDDING (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
                      FileEntryId, FileChunkId, StartIndex, EndIndex, ShortText, Embedding)
```

### OUTBOX_MESSAGE
```
OUTBOX_MESSAGE (Id, RowVersion, CreationTime, LastModificationTime, UserId, IsDeleted,
               EventType, TriggeredById, ObjectId, Payload, Published, ActivityId)
```

---

## TÓM TẮT CÁC TRƯỜNG CHUNG (TỪ BASE ENTITY)

| Trường | Kiểu dữ liệu | Mô tả |
|--------|--------------|--------|
| Id | Guid | Khóa chính |
| RowVersion | uint | Version cho optimistic concurrency |
| CreationTime | DateTimeOffset | Thời gian tạo |
| LastModificationTime | DateTimeOffset? | Thời gian sửa cuối |
| UserId | Guid? | User tạo/sửa (từ IMayHaveUser) |
| IsDeleted | bool | Soft delete flag |

---

**Ghi chú:** 
- Tất cả entities đều kế thừa từ abstract class `Entity`
- `Entity` implement interfaces: `IAuditable`, `ISoftDelete`, `IMayHaveUser`
- Các trường chung được thừa kế tự động từ base class

