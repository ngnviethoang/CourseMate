#### Bảng AntiCheatViolation

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| ContestId | Khóa ngoại tham chiếu đến ContestId | UUID |
| StudentId | Khóa ngoại tham chiếu đến StudentId | UUID |
| ViolationType | Trường ViolationType | INT/VARCHAR |
| Details | Trường Details | VARCHAR(255) |
| OccurredAt | Trường OccurredAt | DATETIME |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng Cart

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| StudentId | Khóa ngoại tham chiếu đến StudentId | UUID |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng CartItem

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| CartId | Khóa ngoại tham chiếu đến CartId | UUID |
| CourseId | Khóa ngoại tham chiếu đến CourseId | UUID |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng Category

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| Name | Tên/Tiêu đề | VARCHAR(255) |
| Description | Mô tả chi tiết | TEXT |
| IsActive | Trạng thái IsActive | BOOLEAN |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng Chapter

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| CourseId | Khóa ngoại tham chiếu đến CourseId | UUID |
| Title | Tên/Tiêu đề | VARCHAR(255) |
| Position | Trường Position | VARCHAR(255) |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng Contest

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| Title | Tên/Tiêu đề | VARCHAR(255) |
| Description | Mô tả chi tiết | TEXT |
| Status | Trường Status | INT/VARCHAR |
| StartTime | Trường StartTime | DATETIME |
| EndTime | Trường EndTime | DATETIME |
| DurationInMinutes | Trường DurationInMinutes | INT |
| AllowedLanguages | Trường AllowedLanguages | VARCHAR(255) |
| MemoryLimit | Trường MemoryLimit | INT |
| TimeLimit | Trường TimeLimit | INT |
| AntiCheatLevel | Trường AntiCheatLevel | INT/VARCHAR |
| CreatorId | Khóa ngoại tham chiếu đến CreatorId | UUID |
| MaxViolations | Trường MaxViolations | INT |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng ContestExercise

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| ContestId | Khóa ngoại tham chiếu đến ContestId | UUID |
| ExerciseId | Khóa ngoại tham chiếu đến ExerciseId | UUID |
| ScoreWeight | Trường ScoreWeight | INT |
| Order | Trường Order | INT |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng ContestPrize

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| ContestId | Khóa ngoại tham chiếu đến ContestId | UUID |
| CourseId | Khóa ngoại tham chiếu đến CourseId | UUID |
| MinRank | Trường MinRank | INT |
| MaxRank | Trường MaxRank | INT |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng ContestRegistration

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| ContestId | Khóa ngoại tham chiếu đến ContestId | UUID |
| StudentId | Khóa ngoại tham chiếu đến StudentId | UUID |
| RegistrationTime | Trường RegistrationTime | DATETIME |
| JoinTime | Trường JoinTime | DATETIME |
| SubmitTime | Trường SubmitTime | DATETIME |
| IsDisqualified | Trạng thái IsDisqualified | BOOLEAN |
| ViolationCount | Trường ViolationCount | INT |
| DisqualifiedAt | Trường DisqualifiedAt | DATETIME |
| DisqualifiedReason | Trường DisqualifiedReason | VARCHAR(255) |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng ContestSubmission

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| ContestId | Khóa ngoại tham chiếu đến ContestId | UUID |
| ExerciseId | Khóa ngoại tham chiếu đến ExerciseId | UUID |
| StudentId | Khóa ngoại tham chiếu đến StudentId | UUID |
| Language | Trường Language | VARCHAR(255) |
| Code | Trường Code | VARCHAR(255) |
| Score | Trường Score | INT |
| TotalTime | Trường TotalTime | INT/VARCHAR |
| TotalMemory | Trường TotalMemory | INT |
| IsFinal | Trạng thái IsFinal | BOOLEAN |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng Course

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| Title | Tên/Tiêu đề | VARCHAR(255) |
| Description | Mô tả chi tiết | TEXT |
| Price | Trường Price | DECIMAL |
| ImageUrl | Trường ImageUrl | VARCHAR(255) |
| IsPublished | Trạng thái IsPublished | BOOLEAN |
| CategoryId | Khóa ngoại tham chiếu đến CategoryId | UUID |
| InstructorId | Khóa ngoại tham chiếu đến InstructorId | UUID |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng Enrollment

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| StudentId | Khóa ngoại tham chiếu đến StudentId | UUID |
| CourseId | Khóa ngoại tham chiếu đến CourseId | UUID |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng Exercise

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| Title | Tên/Tiêu đề | VARCHAR(255) |
| Description | Mô tả chi tiết | TEXT |
| Difficulty | Trường Difficulty | INT/VARCHAR |
| Category | Trường Category | VARCHAR(255) |
| CreatorId | Khóa ngoại tham chiếu đến CreatorId | UUID |
| IsHidden | Trạng thái IsHidden | BOOLEAN |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng ExerciseDefaultCode

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| ExerciseId | Khóa ngoại tham chiếu đến ExerciseId | UUID |
| Language | Trường Language | VARCHAR(255) |
| StarterCode | Trường StarterCode | VARCHAR(255) |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng ExerciseExample

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| Input | Trường Input | VARCHAR(255) |
| Output | Trường Output | VARCHAR(255) |
| Explanation | Trường Explanation | VARCHAR(255) |
| ExerciseId | Khóa ngoại tham chiếu đến ExerciseId | UUID |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng ExerciseSubmission

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| ExerciseId | Khóa ngoại tham chiếu đến ExerciseId | UUID |
| Language | Trường Language | VARCHAR(255) |
| Code | Trường Code | VARCHAR(255) |
| IsPassed | Trạng thái IsPassed | BOOLEAN |
| Score | Trường Score | DOUBLE |
| TotalTime | Trường TotalTime | DOUBLE |
| TotalMemory | Trường TotalMemory | DOUBLE |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng ExerciseTestCase

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| ExerciseId | Khóa ngoại tham chiếu đến ExerciseId | UUID |
| Input | Trường Input | VARCHAR(255) |
| ExpectedOutput | Trường ExpectedOutput | VARCHAR(255) |
| Description | Mô tả chi tiết | TEXT |
| IsHidden | Trạng thái IsHidden | BOOLEAN |
| Order | Trường Order | INT |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng FileChunk

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| FileEntryId | Khóa ngoại tham chiếu đến FileEntryId | UUID |
| ChunkIndex | Trường ChunkIndex | INT |
| ChunkLocation | Trường ChunkLocation | VARCHAR(255) |
| ChunkSize | Trường ChunkSize | BIGINT |
| IsUploaded | Trạng thái IsUploaded | BOOLEAN |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng FileEntry

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| FileName | Trường FileName | VARCHAR(255) |
| FileSize | Trường FileSize | DOUBLE |
| FileLocation | Trường FileLocation | VARCHAR(255) |
| Status | Trường Status | INT/VARCHAR |
| TotalChunks | Trường TotalChunks | INT |
| UploadedChunks | Trường UploadedChunks | INT |
| CompletedAt | Trường CompletedAt | DATETIME |
| FileType | Trường FileType | INT/VARCHAR |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng FileEntryEmbedding

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| FileEntryId | Khóa ngoại tham chiếu đến FileEntryId | UUID |
| FileChunkId | Khóa ngoại tham chiếu đến FileChunkId | UUID |
| StartIndex | Trường StartIndex | INT |
| EndIndex | Trường EndIndex | INT |
| ShortText | Trường ShortText | VARCHAR(255) |
| Embedding | Trường Embedding | INT/VARCHAR |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng Lesson

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| ChapterId | Khóa ngoại tham chiếu đến ChapterId | UUID |
| CourseId | Khóa ngoại tham chiếu đến CourseId | UUID |
| Title | Tên/Tiêu đề | VARCHAR(255) |
| LessonType | Trường LessonType | INT/VARCHAR |
| Position | Trường Position | VARCHAR(255) |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng LessonCoding

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| LessonId | Khóa ngoại tham chiếu đến LessonId | UUID |
| ExerciseId | Khóa ngoại tham chiếu đến ExerciseId | UUID |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng LessonMaterial

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| LessonId | Khóa ngoại tham chiếu đến LessonId | UUID |
| Outline | Trường Outline | VARCHAR(255) |
| DocumentFileId | Khóa ngoại tham chiếu đến DocumentFileId | UUID |
| Status | Trường Status | INT/VARCHAR |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng LessonQuiz

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| LessonId | Khóa ngoại tham chiếu đến LessonId | UUID |
| Description | Mô tả chi tiết | TEXT |
| PassingScore | Trường PassingScore | INT |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng LessonQuizAnswer

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| LessonQuizQuestionId | Khóa ngoại tham chiếu đến LessonQuizQuestionId | UUID |
| Text | Trường Text | VARCHAR(255) |
| IsCorrect | Trạng thái IsCorrect | BOOLEAN |
| Position | Trường Position | INT |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng LessonQuizQuestion

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| LessonQuizId | Khóa ngoại tham chiếu đến LessonQuizId | UUID |
| Text | Trường Text | VARCHAR(255) |
| Position | Trường Position | INT |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng LessonReading

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| LessonId | Khóa ngoại tham chiếu đến LessonId | UUID |
| Content | Trường Content | VARCHAR(255) |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng LessonVideo

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| LessonId | Khóa ngoại tham chiếu đến LessonId | UUID |
| VideoUrl | Trường VideoUrl | VARCHAR(255) |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng Notification

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| ReceiverId | Khóa ngoại tham chiếu đến ReceiverId | UUID |
| Title | Tên/Tiêu đề | VARCHAR(255) |
| Message | Trường Message | VARCHAR(255) |
| IsRead | Trạng thái IsRead | BOOLEAN |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng Order

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| StudentId | Khóa ngoại tham chiếu đến StudentId | UUID |
| TotalAmount | Trường TotalAmount | DECIMAL |
| Status | Trường Status | INT/VARCHAR |
| Description | Mô tả chi tiết | TEXT |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng OrderItem

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| OrderId | Khóa ngoại tham chiếu đến OrderId | UUID |
| CourseId | Khóa ngoại tham chiếu đến CourseId | UUID |
| Price | Trường Price | DECIMAL |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng OutboxMessage

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| EventType | Trường EventType | VARCHAR(255) |
| TriggeredById | Khóa ngoại tham chiếu đến TriggeredById | UUID |
| ObjectId | Khóa ngoại tham chiếu đến ObjectId | VARCHAR(255) |
| Payload | Trường Payload | VARCHAR(255) |
| Published | Trường Published | BOOLEAN |
| ActivityId | Khóa ngoại tham chiếu đến ActivityId | VARCHAR(255) |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng PaymentTransaction

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| Status | Trường Status | INT/VARCHAR |
| Currency | Trường Currency | VARCHAR(255) |
| Amount | Trường Amount | DECIMAL |
| Provider | Trường Provider | VARCHAR(255) |
| FailReason | Trường FailReason | VARCHAR(255) |
| OrderId | Khóa ngoại tham chiếu đến OrderId | UUID |
| TransactionId | Khóa ngoại tham chiếu đến TransactionId | VARCHAR(255) |
| RawRequest | Trường RawRequest | VARCHAR(255) |
| RawResponse | Trường RawResponse | VARCHAR(255) |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng Review

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| CourseId | Khóa ngoại tham chiếu đến CourseId | UUID |
| StudentId | Khóa ngoại tham chiếu đến StudentId | UUID |
| Rating | Trường Rating | INT |
| Comment | Trường Comment | VARCHAR(255) |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng User

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| RowVersion | Trường RowVersion | INT/VARCHAR |
| IsApproved | Trạng thái IsApproved | BOOLEAN |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng UserLessonProgress

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| StudentId | Khóa ngoại tham chiếu đến StudentId | UUID |
| LessonId | Khóa ngoại tham chiếu đến LessonId | UUID |
| IsCompleted | Trạng thái IsCompleted | BOOLEAN |
| Score | Trường Score | DOUBLE |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng IAuditable

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng IMayHaveUser

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |

#### Bảng ISoftDelete

| Thuộc Tính | Diễn giải | Kiểu dữ liệu |
|---|---|---|
| Id | Định danh duy nhất | UUID |
| CreationTime | Thời gian tạo | DATETIME |
| LastModificationTime | Thời gian cập nhật cuối | DATETIME |
| IsDeleted | Đã bị xóa mềm | BOOLEAN |


