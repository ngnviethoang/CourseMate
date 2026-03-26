namespace CourseMate.Contracts.Constants;

public static class ErrorMessages
{
    public const string EntityNotFound = "{0} with Id '{1}' not found";
    public const string InvalidUsernameOrPassword = "Invalid username or password.";
    public const string InvalidFileType = "Invalid file type. This file type is not allowed.";
    public const string InvalidConfiguration = "Invalid configuration: '{0}'";
    public const string ChunkFileMissing = "Chunk {0} for upload '{1}' is missing.";
    public const string UploadIncomplete = "Upload incomplete. {0}/{1} chunks uploaded.";
    public const string FileTooLarge = "File too large";
}