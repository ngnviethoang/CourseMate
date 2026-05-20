namespace CourseMate.Contracts.Constants;

public static class ErrorMessages
{
    public const string EntityNotFound = "{0} with Id '{1}' not found.";
    public const string InvalidUsernameOrPassword = "Thông tin đăng nhập không chính xác.";
    public const string EmailNotVerified = "Tài khoản chưa xác thực email.";
    public const string AccountLocked = "Tài khoản đã bị khóa.";
    public const string InvalidFileType = "Invalid file type. This file type is not allowed.";
    public const string ChunkFileMissing = "Chunk {0} for upload '{1}' is missing.";
    public const string UploadIncomplete = "Upload incomplete. {0}/{1} chunks uploaded.";
    public const string FileTooLarge = "File too large.";
    public const string RoleNotExists = "{0} role does not exist.";
    public const string RoleNotAllowed = "Bạn không có quyền truy cập với vai trò này.";
    public const string PositionOutOfRange = "Position must be 0 or equal to next position '{0}'.";
    public const string DuplicatePosition = "Duplicate position.";
    public const string InvalidIp = "IP address is invalid.";
    public const string EmbeddingFailed = "AI embedding failed.";
    public const string AiGenerationFailed = "AI generation failed";
    public const string EmptyOrder = "Order must contain at least one item.";
    public const string CourseAlreadyInCart = "Course already exists in cart.";
    public const string CourseAlreadyEnrolled = "Student already enrolled in this course.";
    public const string ExerciseAlreadyAddedToContest = "Exercise already added to this contest.";
    public const string DuplicateExerciseOrder = "Exercise order already exists in this contest.";
    public const string UserNotFound = "Không tìm thấy tài khoản.";
    public const string InvalidResetToken = "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.";
    public const string InvalidVerifyToken = "Liên kết xác thực email không hợp lệ hoặc đã hết hạn.";
    public const string GoogleLoginFailed = "Đăng nhập bằng Google không thành công.";
    public const string GoogleLoginCancelled = "Đăng nhập bằng Google đã bị hủy.";
    public const string InvalidOAuthState = "Phiên đăng nhập không hợp lệ. Vui lòng thử lại.";
}