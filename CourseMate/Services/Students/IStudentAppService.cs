using CourseMate.Services.Dtos.Books;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace CourseMate.Services.Students;

public interface IStudentAppService :
    ICrudAppService< //Defines CRUD methods
        BookDto, //Used to show books
        Guid, //Primary key of the book entity
        PagedAndSortedResultRequestDto, //Used for paging/sorting
        CreateUpdateBookDto> //Used to create/update a book
{
}