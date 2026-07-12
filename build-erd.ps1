# Generates D:\project\CourseMate\ERD_CourseMate.docx
# Layout: title page + sectioned tables per entity, each with row header (orange),
# then a single row listing all fields. Mirrors the style of Recommendation_Entities.docx.

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$outDir = 'D:\project\CourseMate'
$tempDir = Join-Path $env:TEMP "erd_build_$(Get-Random)"
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $tempDir 'word') -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $tempDir '_rels') -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $tempDir 'word\_rels') -Force | Out-Null

# ----- helpers to build XML safely -----
function W-Escape([string]$s) {
    return $s.Replace('&','&amp;').Replace('<','&lt;').Replace('>','&gt;').Replace('"','&quot;')
}

function Run([string]$text, [string]$color, [int]$size, [bool]$bold, [bool]$consolas) {
    $rPr = ''
    if ($bold -or $color -or $size -or $consolas) {
        $parts = @()
        if ($bold) { $parts += '<w:b/><w:bCs/>' }
        if ($color) { $parts += "<w:color w:val=`"$color`"/>" }
        if ($size) { $parts += "<w:sz w:val=`"$size`"/><w:szCs w:val=`"$size`"/>" }
        if ($consolas) { $parts += '<w:rFonts w:ascii="Consolas" w:cs="Consolas" w:eastAsia="Consolas" w:hAnsi="Consolas"/>' }
        $rPr = '<w:rPr>' + ($parts -join '') + '</w:rPr>'
    }
    return "<w:r>$rPr<w:t xml:space=`"preserve`">$text</w:t></w:r>"
}

function Paragraph([string[]]$runs, [string]$align = '', [int]$spacingBefore = 0, [int]$spacingAfter = 100) {
    $pPrParts = @("<w:spacing w:after=`"$spacingAfter`" w:before=`"$spacingBefore`"/>")
    if ($align) { $pPrParts += "<w:jc w:val=`"$align`"/>" }
    $pPr = '<w:pPr>' + ($pPrParts -join '') + '</w:pPr>'
    return "<w:p>$pPr$($runs -join '')</w:p>"
}

function HeaderPara([string]$text) {
    return Paragraph(@(Run $text 'E65100' 24 $true $false), 'left', 300, 100)
}

function FieldPara([string]$text) {
    return Paragraph(@(Run $text '000000' 20 $false $true), 'left', 0, 200)
}

function TitlePara([string]$text, [int]$size) {
    return Paragraph(@(Run $text '0000AA' $size $true $false), 'center', 0, 100)
}

function NormalPara([string]$text, [int]$size = 22, [bool]$bold = $false) {
    return Paragraph(@(Run $text '000000' $size $bold $false), 'left', 0, 100)
}

# ----- entity definitions -----
# Each entry: Name, Fields array, Relations array (strings)
$entities = @(
    @{
        Name = 'USER'
        Fields = 'Id (Guid, PK)', 'UserName', 'NormalizedUserName', 'Email', 'NormalizedEmail', 'EmailConfirmed', 'PasswordHash', 'SecurityStamp', 'ConcurrencyStamp', 'PhoneNumber', 'PhoneNumberConfirmed', 'TwoFactorEnabled', 'LockoutEnd', 'LockoutEnabled', 'AccessFailedCount', 'IsApproved', 'CreationTime', 'LastModificationTime', 'IsDeleted'
        Relations = 'IdentityUser<Guid> cơ sở', '1 ── n Enrollment (StudentId → User.Id)', '1 ── n Order (StudentId → User.Id)', '1 ── n Review (StudentId → User.Id)', '1 ── n ContestRegistration (StudentId → User.Id)', '1 ── n ContestSubmission (StudentId → User.Id)', '1 ── n AntiCheatViolation (StudentId → User.Id)', '1 ── n ExerciseSubmission (UserId)', '1 ── n Notification (ReceiverId → User.Id)', '1 ── n Cart (StudentId → User.Id)', '1 ── n Chapter/Exercise/Contest (CreatorId → User.Id)', '1 ── n UserLessonProgress (StudentId → User.Id)', '1 ── n UserRecommendation (UserId → User.Id)', '1 ── n ChatConversation (UserId → User.Id)', '1 ── n StudentSkillProfile (StudentId → User.Id)', '1 ── 1 StudentPreference (StudentId → User.Id)'
    },
    @{
        Name = 'CATEGORY'
        Fields = 'Id (Guid, PK)', 'Name', 'Description', 'IsActive', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = '1 ── n Course (CategoryId → Category.Id)'
    },
    @{
        Name = 'COURSE'
        Fields = 'Id (Guid, PK)', 'Title', 'Description', 'Price (decimal)', 'ImageUrl', 'IsPublished', 'CategoryId (FK → Category)', 'InstructorId (FK → User)', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 Category', 'n ── 1 User (Instructor)', '1 ── n Chapter', '1 ── n Lesson', '1 ── n Enrollment', '1 ── n Review', '1 ── n OrderItem', '1 ── n CartItem', '1 ── n UserRecommendation', '1 ── n CourseSimilarity (CourseId)', '1 ── n CourseSimilarity (SimilarCourseId)', '1 ── n CourseCoOccurrence', '1 ── 1 CourseEmbedding', '1 ── n ContestPrize', '1 ── n LessonMaterial', '1 ── 1 StudentPreference (favourite courses lưu trong FavouriteCategories)'
    },
    @{
        Name = 'CHAPTER'
        Fields = 'Id (Guid, PK)', 'CourseId (FK → Course)', 'Title', 'Position', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 Course', '1 ── n Lesson'
    },
    @{
        Name = 'LESSON'
        Fields = 'Id (Guid, PK)', 'ChapterId (FK → Chapter)', 'CourseId (FK → Course)', 'Title', 'LessonType (enum: Video/Reading/Coding/Quiz/Slide)', 'Position', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 Chapter', 'n ── 1 Course', '0..1 ── 1 LessonVideo', '0..1 ── 1 LessonReading', '0..1 ── 1 LessonCoding', '0..1 ── 1 LessonQuiz', '1 ── n UserLessonProgress'
    },
    @{
        Name = 'LESSON_VIDEO'
        Fields = 'Id (Guid, PK)', 'LessonId (FK → Lesson)', 'VideoUrl', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 Lesson'
    },
    @{
        Name = 'LESSON_READING'
        Fields = 'Id (Guid, PK)', 'LessonId (FK → Lesson)', 'Content', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 Lesson'
    },
    @{
        Name = 'LESSON_CODING'
        Fields = 'Id (Guid, PK)', 'LessonId (FK → Lesson)', 'ExerciseId (FK → Exercise)', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 Lesson', 'n ── 1 Exercise'
    },
    @{
        Name = 'LESSON_QUIZ'
        Fields = 'Id (Guid, PK)', 'LessonId (FK → Lesson)', 'Description', 'PassingScore (int)', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 Lesson', '1 ── n LessonQuizQuestion'
    },
    @{
        Name = 'LESSON_QUIZ_QUESTION'
        Fields = 'Id (Guid, PK)', 'LessonQuizId (FK → LessonQuiz)', 'Text', 'Position (int)', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 LessonQuiz', '1 ── n LessonQuizAnswer'
    },
    @{
        Name = 'LESSON_QUIZ_ANSWER'
        Fields = 'Id (Guid, PK)', 'LessonQuizQuestionId (FK → LessonQuizQuestion)', 'Text', 'IsCorrect (bool)', 'Position (int)', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 LessonQuizQuestion'
    },
    @{
        Name = 'LESSON_MATERIAL'
        Fields = 'Id (Guid, PK)', 'LessonId (FK → Lesson)', 'Outline', 'DocumentFileId (FK → FileEntry)', 'Status (enum: Pending/Processing/Ready/Failed)', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 Lesson', 'n ── 1 FileEntry'
    },
    @{
        Name = 'REVIEW'
        Fields = 'Id (Guid, PK)', 'CourseId (FK → Course)', 'StudentId (FK → User)', 'Rating (int 1-5)', 'Comment', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 Course', 'n ── 1 User (Student)'
    },
    @{
        Name = 'ENROLLMENT'
        Fields = 'Id (Guid, PK)', 'StudentId (FK → User)', 'CourseId (FK → Course)', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 User (Student)', 'n ── 1 Course'
    },
    @{
        Name = 'USER_LESSON_PROGRESS'
        Fields = 'Id (Guid, PK)', 'StudentId (FK → User)', 'LessonId (FK → Lesson)', 'IsCompleted (bool)', 'Score (double)', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 User (Student)', 'n ── 1 Lesson'
    },
    @{
        Name = 'CART'
        Fields = 'Id (Guid, PK)', 'StudentId (FK → User)', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 User (Student)', '1 ── n CartItem'
    },
    @{
        Name = 'CART_ITEM'
        Fields = 'Id (Guid, PK)', 'CartId (FK → Cart)', 'CourseId (FK → Course)', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 Cart', 'n ── 1 Course'
    },
    @{
        Name = 'ORDER'
        Fields = 'Id (Guid, PK)', 'StudentId (FK → User)', 'TotalAmount (decimal)', 'Status (enum: Pending/Paid/Failed/Cancelled/Refunded)', 'Description', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 User (Student)', '1 ── n OrderItem', '1 ── n PaymentTransaction'
    },
    @{
        Name = 'ORDER_ITEM'
        Fields = 'Id (Guid, PK)', 'OrderId (FK → Order)', 'CourseId (FK → Course)', 'Price (decimal)', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 Order', 'n ── 1 Course'
    },
    @{
        Name = 'PAYMENT_TRANSACTION'
        Fields = 'Id (Guid, PK)', 'OrderId (FK → Order)', 'Status (enum: Created/Paid/Failed/Cancelled)', 'Currency', 'Amount (decimal)', 'Provider', 'TransactionId', 'RawRequest', 'RawResponse', 'FailReason', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 Order'
    },
    @{
        Name = 'NOTIFICATION'
        Fields = 'Id (Guid, PK)', 'ReceiverId (FK → User)', 'Title', 'Message', 'IsRead (bool)', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 User (Receiver)'
    },
    @{
        Name = 'FILE_ENTRY'
        Fields = 'Id (Guid, PK)', 'FileName', 'FileSize (double)', 'FileLocation', 'Status (enum)', 'TotalChunks (int)', 'UploadedChunks (int)', 'CompletedAt?', 'FileType (enum)', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = '1 ── n FileChunk', '1 ── n FileEntryEmbedding', '1 ── n LessonMaterial'
    },
    @{
        Name = 'FILE_CHUNK'
        Fields = 'Id (Guid, PK)', 'FileEntryId (FK → FileEntry)', 'ChunkIndex (int)', 'ChunkLocation', 'ChunkSize (long)', 'IsUploaded (bool)', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 FileEntry', '1 ── n FileEntryEmbedding'
    },
    @{
        Name = 'FILE_ENTRY_EMBEDDING'
        Fields = 'Id (Guid, PK)', 'FileEntryId (FK → FileEntry)', 'FileChunkId (FK → FileChunk)', 'StartIndex (int)', 'EndIndex (int)', 'ShortText', 'Embedding (vector)', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 FileEntry', 'n ── 1 FileChunk'
    },
    @{
        Name = 'EXERCISE'
        Fields = 'Id (Guid, PK)', 'Title', 'Description', 'Difficulty (enum)', 'Category', 'CreatorId (FK → User)', 'Constraints (string[])', 'Hints (string[])', 'IsHidden (bool)', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 User (Creator)', '1 ── n ExerciseExample', '1 ── n ExerciseTestCase', '1 ── n ExerciseDefaultCode', '1 ── n ExerciseSubmission', '1 ── n LessonCoding', '1 ── n ContestExercise', '1 ── n ContestSubmission'
    },
    @{
        Name = 'EXERCISE_EXAMPLE'
        Fields = 'Id (Guid, PK)', 'ExerciseId (FK → Exercise)', 'Input', 'Output', 'Explanation', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 Exercise'
    },
    @{
        Name = 'EXERCISE_TEST_CASE'
        Fields = 'Id (Guid, PK)', 'ExerciseId (FK → Exercise)', 'Input', 'ExpectedOutput', 'Description', 'IsHidden (bool)', 'Order (int)', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 Exercise'
    },
    @{
        Name = 'EXERCISE_DEFAULT_CODE'
        Fields = 'Id (Guid, PK)', 'ExerciseId (FK → Exercise)', 'Language', 'StarterCode', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 Exercise'
    },
    @{
        Name = 'EXERCISE_SUBMISSION'
        Fields = 'Id (Guid, PK)', 'ExerciseId (FK → Exercise)', 'Language', 'Code', 'IsPassed (bool)', 'Score (double)', 'TotalTime (double)', 'TotalMemory (double)', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 Exercise'
    },
    @{
        Name = 'CONTEST'
        Fields = 'Id (Guid, PK)', 'Title', 'Description', 'Status (enum)', 'StartTime?', 'EndTime?', 'DurationInMinutes (int)', 'AllowedLanguages', 'MemoryLimit (int)', 'TimeLimit (int)', 'AntiCheatLevel (enum)', 'CreatorId (FK → User)', 'MaxViolations (int)', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 User (Creator)', '1 ── n ContestExercise', '1 ── n ContestRegistration', '1 ── n ContestSubmission', '1 ── n ContestPrize', '1 ── n AntiCheatViolation'
    },
    @{
        Name = 'CONTEST_EXERCISE'
        Fields = 'Id (Guid, PK)', 'ContestId (FK → Contest)', 'ExerciseId (FK → Exercise)', 'ScoreWeight (int)', 'Order (int)', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 Contest', 'n ── 1 Exercise'
    },
    @{
        Name = 'CONTEST_PRIZE'
        Fields = 'Id (Guid, PK)', 'ContestId (FK → Contest)', 'CourseId (FK → Course)', 'MinRank (int)', 'MaxRank (int)', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 Contest', 'n ── 1 Course'
    },
    @{
        Name = 'CONTEST_REGISTRATION'
        Fields = 'Id (Guid, PK)', 'ContestId (FK → Contest)', 'StudentId (FK → User)', 'RegistrationTime', 'JoinTime?', 'SubmitTime?', 'IsDisqualified (bool)', 'ViolationCount (int)', 'DisqualifiedAt?', 'DisqualifiedReason', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 Contest', 'n ── 1 User (Student)'
    },
    @{
        Name = 'CONTEST_SUBMISSION'
        Fields = 'Id (Guid, PK)', 'ContestId (FK → Contest)', 'ExerciseId (FK → Exercise)', 'StudentId (FK → User)', 'Language', 'Code', 'Score (int)', 'TotalTime (float)', 'TotalMemory (int)', 'IsFinal (bool)', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 Contest', 'n ── 1 Exercise', 'n ── 1 User (Student)'
    },
    @{
        Name = 'ANTI_CHEAT_VIOLATION'
        Fields = 'Id (Guid, PK)', 'ContestId (FK → Contest)', 'StudentId (FK → User)', 'ViolationType (enum)', 'Details', 'OccurredAt', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 Contest', 'n ── 1 User (Student)'
    },
    @{
        Name = 'CHAT_CONVERSATION'
        Fields = 'Id (Guid, PK)', 'UserId (FK → User)', 'Title', 'CourseId?', 'LessonId?', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 User', '1 ── n ChatMessage'
    },
    @{
        Name = 'CHAT_MESSAGE'
        Fields = 'Id (Guid, PK)', 'ConversationId (FK → ChatConversation)', 'Role (enum: User/Assistant)', 'Content', 'SourceChunkIds?', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 ChatConversation'
    },
    @{
        Name = 'COURSE_EMBEDDING'
        Fields = 'Id (Guid, PK)', 'CourseId (FK → Course)', 'Embedding (vector)', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 Course'
    },
    @{
        Name = 'COURSE_SIMILARITY'
        Fields = 'Id (Guid, PK)', 'CourseId (FK → Course)', 'SimilarCourseId (FK → Course)', 'Score (double)', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 Course', 'n ── 1 Course (Similar)'
    },
    @{
        Name = 'COURSE_CO_OCCURRENCE'
        Fields = 'Id (Guid, PK)', 'CourseId (FK → Course)', 'CoCourseId (FK → Course)', 'Weight (double)', 'CoCount (int)', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 Course', 'n ── 1 Course (Co)'
    },
    @{
        Name = 'USER_RECOMMENDATION'
        Fields = 'Id (Guid, PK)', 'UserId (FK → User)', 'CourseId (FK → Course)', 'Score (double)', 'Rank (int)', 'GeneratedAt', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 User', 'n ── 1 Course'
    },
    @{
        Name = 'STUDENT_PREFERENCE'
        Fields = 'Id (Guid, PK)', 'StudentId (FK → User, unique)', 'FavouriteCategories (string[], jsonb — đang được tận dụng lưu favourite course ids dạng "course:{guid}")', 'PreferredDifficulty (int)', 'LearningGoal', 'MinutesPerDay (int)', 'SkillLevel', 'RecommendContests (bool)', 'RecommendExercises (bool)', 'AutoRefresh (bool)', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = '1 ── 1 User (Student)'
    },
    @{
        Name = 'STUDENT_SKILL_PROFILE'
        Fields = 'Id (Guid, PK)', 'StudentId (FK → User)', 'Category', 'Difficulty (int)', 'TotalAttempts (int)', 'PassedAttempts (int)', 'AverageScore (double)', 'AverageRuntime (double)', 'MasteryScore (double)', 'IsWeakArea (bool)', 'LastAttemptedAt', 'RowVersion', 'CreationTime', 'LastModificationTime', 'UserId?', 'IsDeleted'
        Relations = 'n ── 1 User (Student)'
    }
)

# ----- build document body -----
$bodyParts = @()

# Title
$bodyParts += TitlePara 'COURSE MATE — ERD TONG THE' 36
$bodyParts += TitlePara 'Entity Relationship Diagram' 24
$bodyParts += Paragraph(@(Run 'Tong hop cac entity trong D:\project\CourseMate\CourseMate.Persistent\Entities' '666666' 20 $false $false), 'center', 0, 300)

# Abstract section
$bodyParts += HeaderPara 'ENTITY CO SO (ABSTRACT)'
$bodyParts += FieldPara 'Entity (abstract) — IAuditable + ISoftDelete + IMayHaveUser'
$bodyParts += FieldPara '(Id (Guid, PK), RowVersion (uint), CreationTime, LastModificationTime?, UserId?, IsDeleted)'
$bodyParts += NormalPara 'User — ke thua IdentityUser<Guid>, IAuditable, ISoftDelete' 20 $true
$bodyParts += FieldPara '(Id, UserName, NormalizedUserName, Email, EmailConfirmed, PasswordHash, SecurityStamp, ConcurrencyStamp, PhoneNumber, PhoneNumberConfirmed, TwoFactorEnabled, LockoutEnd, LockoutEnabled, AccessFailedCount, IsApproved, CreationTime, LastModificationTime?, IsDeleted)'

# Per-entity sections
foreach ($e in $entities) {
    $bodyParts += HeaderPara $e.Name
    $bodyParts += FieldPara ('(' + ($e.Fields -join ', ') + ')')
    foreach ($rel in $e.Relations) {
        $bodyParts += NormalPara ('• ' + $rel) 20 $false
    }
}

# Section properties
$body = $bodyParts -join ''
$documentXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body>
$body
<w:sectPr>
<w:pgSz w:w="11906" w:h="16838" w:orient="portrait"/>
<w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="708" w:footer="708" w:gutter="0"/>
<w:pgNumType/>
<w:docGrid w:linePitch="360"/>
</w:sectPr>
</w:body>
</w:document>
"@

Set-Content -Path (Join-Path $tempDir 'word\document.xml') -Value $documentXml -Encoding UTF8

# ----- styles.xml -----
$stylesXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:docDefaults>
<w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr></w:rPrDefault>
<w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="276" w:lineRule="auto"/></w:pPr></w:pPrDefault>
</w:docDefaults>
</w:styles>
"@
Set-Content -Path (Join-Path $tempDir 'word\styles.xml') -Value $stylesXml -Encoding UTF8

# ----- [Content_Types].xml -----
$contentTypesXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>
"@
Set-Content -Path (Join-Path $tempDir '[Content_Types].xml') -Value $contentTypesXml -Encoding UTF8

# ----- _rels/.rels -----
$relsXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>
"@
Set-Content -Path (Join-Path $tempDir '_rels\.rels') -Value $relsXml -Encoding UTF8

# ----- word/_rels/document.xml.rels -----
$docRelsXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>
"@
Set-Content -Path (Join-Path $tempDir 'word\_rels\document.xml.rels') -Value $docRelsXml -Encoding UTF8

# ----- zip up -----
$zipPath = Join-Path $outDir 'ERD_CourseMate.docx'
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

$tempZip = $zipPath + '.tmp'
[System.IO.Compression.ZipFile]::CreateFromDirectory($tempDir, $tempZip)

Move-Item $tempZip $zipPath -Force
Remove-Item $tempDir -Recurse -Force

Write-Output "OK: $zipPath"