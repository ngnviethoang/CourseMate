using CourseMate.Contracts.Enums;

namespace CourseMate.Application.Services.AIServices;

public sealed record ChatTurn(ChatRole Role, string Content);
