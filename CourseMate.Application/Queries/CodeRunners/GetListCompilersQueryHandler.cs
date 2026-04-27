using CourseMate.Application.Services.CodeRunnerServices;
using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Persistent;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Queries.CodeRunners;

public class GetListCompilersQuery : IRequest<IEnumerable<CompilerInfo>>;

internal sealed class GetListCompilersQueryHandler : AbstractQueryHandler<GetListCompilersQuery, IEnumerable<CompilerInfo>>
{
    private readonly ICodeRunnerService _codeRunnerService;

    public GetListCompilersQueryHandler(
        CourseMateReadOnlyDbContext dbContext,
        IHttpContextAccessor httpContextAccessor,
        ICodeRunnerService codeRunnerService) : base(dbContext, httpContextAccessor)
    {
        _codeRunnerService = codeRunnerService;
    }

    public override async Task<IEnumerable<CompilerInfo>> Handle(GetListCompilersQuery request, CancellationToken ct)
    {
        return await _codeRunnerService.GetCompilersAsync(ct);
    }
}