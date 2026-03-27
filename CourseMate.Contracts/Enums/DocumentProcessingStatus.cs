namespace CourseMate.Contracts.Enums;

public enum DocumentProcessingStatus
{
    Uploaded = 0,
    Parsing = 1,
    Parsed = 2,
    GeneratingOutline = 3,
    OutlineReady = 4,
    GeneratingSlide = 5,
    SlideReady = 6,
    Failed = 99
}