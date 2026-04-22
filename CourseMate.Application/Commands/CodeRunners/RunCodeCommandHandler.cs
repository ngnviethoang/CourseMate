using System.ComponentModel.DataAnnotations;
using CourseMate.Application.Services.CodeRunners;
using CourseMate.Application.Shared;
using CourseMate.Contracts;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Commands.CodeRunners;

public class RunCodeCommand : IRequest<RunCodeResponse>
{
    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Code { get; set; } = string.Empty;

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Compiler { get; set; } = string.Empty;

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Input { get; set; } = string.Empty;
}

internal sealed class RunCodeCommandHandler : AbstractCommandHandler<RunCodeCommand, RunCodeResponse>
{
    private readonly ICodeRunnerService _codeRunnerService;

    public RunCodeCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor,
        ICodeRunnerService codeRunnerService) : base(dbContext, httpContextAccessor)
    {
        _codeRunnerService = codeRunnerService;
    }

    public override async Task<RunCodeResponse> Handle(RunCodeCommand request, CancellationToken cancellationToken)
    {
        return await _codeRunnerService.RunAsync(request.Code, request.Compiler, request.Input, cancellationToken);
    }
}