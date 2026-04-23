using CourseMate.Application.Commands.Categories;
using CourseMate.Application.Queries.Categories;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CourseMate.API.Controllers;

[ApiController]
[Route("api/categories")]
[Authorize]
public class CategoryController : ControllerBase
{
    private readonly IMediator _mediator;

    public CategoryController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult> GetListAsync([FromQuery] GetListCategoriesQuery request)
    {
        PagedDto<CategoryDto> result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult> GetByIdAsync(Guid id)
    {
        CategoryDto? result = await _mediator.Send(new GetCategoryByIdQuery { Id = id });
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult> CreateAsync(CreateCategoryCommand request)
    {
        ResultIdDto result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult> UpdateAsync(Guid id, UpdateCategoryCommand request)
    {
        request.Id = id;
        await _mediator.Send(request);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult> DeleteAsync(Guid id)
    {
        await _mediator.Send(new DeleteCategoryCommand { Id = id });
        return NoContent();
    }
}