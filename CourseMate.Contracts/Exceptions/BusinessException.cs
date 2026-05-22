using CourseMate.Contracts.Constants;

namespace CourseMate.Contracts.Exceptions;

public class BusinessException : Exception
{
    public BusinessException(ErrorCode errorCode, string message) : base(message)
    {
        ErrorCode = errorCode;
    }

    public BusinessException(ErrorCode errorCode, string message, Exception innerException) : base(message, innerException)
    {
        ErrorCode = errorCode;
    }

    public BusinessException(string message) : base(message)
    {
        ErrorCode = ErrorCode.Unknown;
    }

    public BusinessException(string message, Exception innerException) : base(message, innerException)
    {
        ErrorCode = ErrorCode.Unknown;
    }

    public ErrorCode ErrorCode { get; }
}