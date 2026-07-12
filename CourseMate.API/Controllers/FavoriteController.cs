using CourseMate.Application.Commands.Favorites;
using CourseMate.Application.Queries.Favorites;
using CourseMate.Contracts.DTOs.Favorites;
using CourseMate.Contracts.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CourseMate.API.Controllers;

[ApiController]
[Route("api/favorites")]
[Authorize(Roles = $"{Roles.Admin},{Roles.Student}")]
public class FavoriteController : ControllerBase
{
    private readonly IMediator _mediator;

    public FavoriteController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<List<FavoriteCourseDto>>> GetMyFavorites([FromQuery] GetMyFavoritesQuery request)
    {
        List<FavoriteCourseDto> result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<bool>> ToggleFavorite([FromBody] ToggleFavoriteCourseCommand command)
    {
        bool isNowFavorite = await _mediator.Send(command);
        return Ok(isNowFavorite);
    }
}
