using System.ComponentModel.DataAnnotations;
using MediatR;

namespace CourseMate.Contracts.DTOs.Instructors;

public class UpdateCourseCommand : IRequest<int>
{
    public Guid Id { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string ImageUrl { get; set; } = string.Empty;

    public bool IsPublished { get; set; }

    public Guid CategoryId { get; set; }

    public Guid InstructorId { get; set; }
}