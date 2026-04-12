using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Persistent;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Commands.Courses;

public class RegenerateOutlineCommand : IRequest<ProcessingStatusDto>
{
    public Guid LessonId { get; set; }
}

internal sealed class RegenerateOutlineCommandHandler : AbstractCommandHandler<RegenerateOutlineCommand, ProcessingStatusDto>
{
    public RegenerateOutlineCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ProcessingStatusDto> Handle(RegenerateOutlineCommand request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}