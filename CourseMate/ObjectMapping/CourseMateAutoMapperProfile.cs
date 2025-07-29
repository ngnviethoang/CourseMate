using AutoMapper;
using CourseMate.Entities.Categories;
using CourseMate.Entities.Chapters;
using CourseMate.Entities.Courses;
using CourseMate.Entities.Enrollments;
using CourseMate.Entities.Lessons;
using CourseMate.Entities.Orders;
using CourseMate.Entities.PaymentRequests;
using CourseMate.Entities.Reviews;
using CourseMate.Services.Dtos.Carts;
using CourseMate.Services.Dtos.Categories;
using CourseMate.Services.Dtos.Chapters;
using CourseMate.Services.Dtos.Courses;
using CourseMate.Services.Dtos.Lessons;
using CourseMate.Services.Dtos.Orders;
using CourseMate.Services.Dtos.PaymentRequests;
using CourseMate.Services.Dtos.Reviews;

namespace CourseMate.ObjectMapping;

public class CourseMateAutoMapperProfile : Profile
{
    public CourseMateAutoMapperProfile()
    {
        CreateMap<Category, CategoryDto>();
        CreateMap<CreateUpdateCategoryDto, Category>();
        CreateMap<CategoryDto, CreateUpdateCategoryDto>();

        CreateMap<Chapter, ChapterDto>();
        CreateMap<CreateUpdateChapterDto, Chapter>();
        CreateMap<ChapterDto, CreateUpdateChapterDto>();

        CreateMap<Course, CourseDto>();
        CreateMap<CreateUpdateCourseDto, Course>();
        CreateMap<CourseDto, CreateUpdateCourseDto>();

        CreateMap<Enrollment, CartDto>();
        CreateMap<CreateCartDto, Enrollment>();
        CreateMap<CartDto, CreateCartDto>();

        CreateMap<Lesson, LessonDto>();
        CreateMap<CreateUpdateLessonDto, Lesson>();
        CreateMap<LessonDto, CreateUpdateLessonDto>();

        CreateMap<Order, OrderDto>();
        CreateMap<CreateUpdateOrderDto, Order>();
        CreateMap<OrderDto, CreateUpdateOrderDto>();

        CreateMap<OrderItem, OrderItemDto>();

        CreateMap<PaymentRequest, PaymentRequestDto>();
        CreateMap<CreateUpdatePaymentRequestDto, PaymentRequest>();
        CreateMap<PaymentRequestDto, CreateUpdatePaymentRequestDto>();

        CreateMap<Review, ReviewDto>();
        CreateMap<CreateUpdateReviewDto, Review>();
        CreateMap<ReviewDto, CreateUpdateReviewDto>();
    }
}