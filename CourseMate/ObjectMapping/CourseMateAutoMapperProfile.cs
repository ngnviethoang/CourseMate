using AutoMapper;
using CourseMate.Entities.Books;
using CourseMate.Services.Dtos.Books;

namespace CourseMate.ObjectMapping;

public class CourseMateAutoMapperProfile : Profile
{
    public CourseMateAutoMapperProfile()
    {
        CreateMap<Book, BookDto>();
        CreateMap<CreateUpdateBookDto, Book>();
        CreateMap<BookDto, CreateUpdateBookDto>();
        /* Create your AutoMapper object mappings here */
    }
}