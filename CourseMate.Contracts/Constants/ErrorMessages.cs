namespace CourseMate.Contracts.Constants;

public enum ErrorCode
{
    Unknown,
    EntityNotFound,
    InvalidUsernameOrPassword,
    EmailNotVerified,
    AccountLocked,
    InvalidFileType,
    ChunkFileMissing,
    UploadIncomplete,
    FileTooLarge,
    RoleNotExists,
    RoleNotAllowed,
    PositionOutOfRange,
    DuplicatePosition,
    InvalidIp,
    EmbeddingFailed,
    AiGenerationFailed,
    EmptyOrder,
    CourseAlreadyInCart,
    CourseAlreadyEnrolled,
    CategoryHasCourses,
    ExerciseAlreadyAddedToContest,
    DuplicateExerciseOrder,
    UserNotFound,
    InvalidResetToken,
    GoogleLoginFailed,
    GoogleLoginCancelled,
    InvalidOAuthState,
    AccountPendingApproval
}