using CourseMate.Entities.Books;
using CourseMate.Services.Books;
using CourseMate.Services.Dtos.Books;
using CourseMate.Tests.TestBase;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Validation;

namespace CourseMate.Tests.Services.Books;

public sealed class BookAppServiceTests : CourseMateTestBase<CourseMateTestModule>
{
    private readonly IBookAppService _bookAppService;

    public BookAppServiceTests()
    {
        _bookAppService = GetRequiredService<IBookAppService>();
    }

    [Fact]
    public async Task ShouldGetListOfBooks()
    {
        var result = await _bookAppService.GetListAsync(
            new PagedAndSortedResultRequestDto()
        );

        Assert.True(result.TotalCount > 0);
        Assert.Contains(result.Items, b => b.Name == "1984");
    }

    [Fact]
    public async Task ShouldNotCreateABookWithoutName()
    {
        var exception = await Assert.ThrowsAsync<AbpValidationException>(async () =>
        {
            await _bookAppService.CreateAsync(
                new CreateUpdateBookDto
                {
                    Name = "",
                    Price = 10,
                    PublishDate = DateTime.Now,
                    Type = BookType.ScienceFiction
                }
            );
        });

        Assert.Contains(exception.ValidationErrors, err => err.MemberNames.Any(m => m == "Name"));
    }
}