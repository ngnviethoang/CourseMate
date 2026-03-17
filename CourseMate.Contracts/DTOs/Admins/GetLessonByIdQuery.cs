using MediatR;

namespace CourseMate.Contract.DTOs.Admins;

public class GetLessonByIdQuery : IRequest<LessonDto?>
{
    public GetLessonByIdQuery(Guid id)
    {
        Id = id;
    }

    public Guid Id { get; set; }
}