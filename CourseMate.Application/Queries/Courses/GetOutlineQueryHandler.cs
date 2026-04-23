using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Persistent;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Queries.Courses;

public class GetOutlineQuery : IRequest<OutlineDto?>
{
    public Guid LessonId { get; set; }
}

internal sealed class GetOutlineQueryHandler : AbstractQueryHandler<GetOutlineQuery, OutlineDto?>
{
    public GetOutlineQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<OutlineDto?> Handle(GetOutlineQuery request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}