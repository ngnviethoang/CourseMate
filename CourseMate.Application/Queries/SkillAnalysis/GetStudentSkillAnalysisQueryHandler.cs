using CourseMate.Application.Services.SkillAnalysisServices;
using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Persistent;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Queries.SkillAnalysis;

public class GetStudentSkillAnalysisQuery : IRequest<StudentSkillAnalysisDto>
{
}

internal sealed class GetStudentSkillAnalysisQueryHandler : AbstractQueryHandler<GetStudentSkillAnalysisQuery, StudentSkillAnalysisDto>
{
    private readonly ISkillAnalysisService _service;

    public GetStudentSkillAnalysisQueryHandler(
        CourseMateReadOnlyDbContext dbContext,
        IHttpContextAccessor httpContextAccessor,
        ISkillAnalysisService service) : base(dbContext, httpContextAccessor)
    {
        _service = service;
    }

    public override async Task<StudentSkillAnalysisDto> Handle(GetStudentSkillAnalysisQuery request, CancellationToken ct)
    {
        return await _service.BuildAnalysisAsync(CurrentUserId, ct);
    }
}