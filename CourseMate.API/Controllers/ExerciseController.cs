using CourseMate.Application.Commands.Exercises;
using CourseMate.Application.Commands.Submissions;
using CourseMate.Application.Queries.Exercises;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.DTOs.Exercises;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CourseMate.API.Controllers;

[ApiController]
[Route("api/exercises")]
[Authorize]
public class ExerciseController : ControllerBase
{
    private readonly IMediator _mediator;

    public ExerciseController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult> GetListExercisesAsync([FromQuery] GetListExercisesQuery request)
    {
        PagedDto<ExerciseDto> result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult> GetExerciseByIdAsync(Guid id)
    {
        GetExerciseByIdResponse? result = await _mediator.Send(new GetExerciseByIdQuery { Id = id });
        return Ok(result);
    }

    // TODO Need review
    [HttpGet("{id:guid}/student")]
    // [Authorize(Roles = Roles.Student)]
    public async Task<ActionResult> GetStudentExerciseByIdAsync(Guid id)
    {
        GetStudentExerciseByIdResponse? result = await _mediator.Send(new GetStudentExerciseByIdQuery { Id = id });
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> CreateExerciseAsync(CreateExerciseCommand request)
    {
        ResultIdDto result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> UpdateExerciseAsync(Guid id, UpdateExerciseCommand request)
    {
        request.Id = id;
        await _mediator.Send(request);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> DeleteExerciseAsync(Guid id)
    {
        await _mediator.Send(new DeleteExerciseCommand { Id = id });
        return NoContent();
    }

    #region Default Code APIs

    [HttpPost("{id:guid}/default-codes")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> CreateOrUpdateDefaultCodeAsync(Guid id, CreateOrUpdateDefaultCodeCommand request)
    {
        request.ExerciseId = id;
        await _mediator.Send(request);
        return NoContent();
    }

    #endregion

    #region Test Case APIs

    [HttpPost("{id:guid}/test-cases")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> CreateTestCaseAsync(Guid id, CreateTestCaseCommand request)
    {
        request.ExerciseId = id;
        ResultIdDto result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpPut("{id:guid}/test-cases/{tcId:guid}")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> UpdateTestCaseAsync(Guid id, Guid tcId, UpdateTestCaseCommand request)
    {
        request.Id = tcId;
        await _mediator.Send(request);
        return NoContent();
    }

    [HttpDelete("{id:guid}/test-cases/{tcId:guid}")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Instructor}")]
    public async Task<ActionResult> DeleteTestCaseAsync(Guid id, Guid tcId)
    {
        await _mediator.Send(new DeleteTestCaseCommand { Id = tcId });
        return NoContent();
    }

    #endregion

    #region Submissions APIs

    // TODO Need review
    [HttpPost("{id:guid}/submissions")]
    public async Task<ActionResult> SubmitExerciseAsync(Guid id, [FromBody] SubmitExerciseRequest request)
    {
        SubmitExerciseCommand command = new()
        {
            ExerciseId = id,
            Payload = request
        };
        ResultIdDto result = await _mediator.Send(command);
        return Ok(result);
    }

    // TODO Need review
    [HttpGet("{id:guid}/submissions")]
    // [Authorize(Roles = Roles.Student)]
    public async Task<ActionResult> GetStudentExerciseSubmissionsAsync(Guid id)
    {
        IEnumerable<ExerciseSubmissionDto> result = await _mediator.Send(new GetStudentExerciseSubmissionsQuery { ExerciseId = id });
        return Ok(result);
    }

    #endregion
}