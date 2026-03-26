using MediatR;

namespace CourseMate.Contracts.DTOs.Admins;

public class DeleteChapterCommand : IRequest<int>
{
    public Guid Id { get; set; }
}