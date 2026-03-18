using MediatR;

namespace CourseMate.Contracts.DTOs.Admins;

public class DeleteChapterCommand : IRequest
{
    public Guid Id { get; set; }
}