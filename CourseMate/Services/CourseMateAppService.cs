using CourseMate.Entities.Categories;
using CourseMate.Entities.Chapters;
using CourseMate.Entities.Courses;
using CourseMate.Entities.Enrollments;
using CourseMate.Entities.Lessons;
using CourseMate.Entities.Notifications;
using CourseMate.Entities.Orders;
using CourseMate.Entities.PaymentRequests;
using CourseMate.Entities.Reviews;
using CourseMate.Localization;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;

namespace CourseMate.Services;

/* Inherit your application services from this class. */
public abstract class CourseMateAppService : ApplicationService
{
    protected CourseMateAppService()
    {
        LocalizationResource = typeof(CourseMateResource);
    }

    protected IRepository<IdentityUser, Guid> UserRepo => LazyServiceProvider.GetRequiredService<IRepository<IdentityUser, Guid>>();
    protected IRepository<Category, Guid> CategoryRepo => LazyServiceProvider.GetRequiredService<IRepository<Category, Guid>>();
    protected IRepository<Chapter, Guid> ChapterRepo => LazyServiceProvider.GetRequiredService<IRepository<Chapter, Guid>>();
    protected IRepository<Course, Guid> CourseRepo => LazyServiceProvider.GetRequiredService<IRepository<Course, Guid>>();
    protected IRepository<Enrollment, Guid> EnrollmentRepo => LazyServiceProvider.GetRequiredService<IRepository<Enrollment, Guid>>();
    protected IRepository<Lesson, Guid> LessonRepo => LazyServiceProvider.GetRequiredService<IRepository<Lesson, Guid>>();
    protected IRepository<Order, Guid> OrderRepo => LazyServiceProvider.GetRequiredService<IRepository<Order, Guid>>();
    protected IRepository<OrderItem, Guid> OrderItemRepo => LazyServiceProvider.GetRequiredService<IRepository<OrderItem, Guid>>();
    protected IRepository<PaymentRequest, Guid> PaymentRequestRepo => LazyServiceProvider.GetRequiredService<IRepository<PaymentRequest, Guid>>();
    protected IRepository<Review, Guid> ReviewRepo => LazyServiceProvider.GetRequiredService<IRepository<Review, Guid>>();
    protected IRepository<Notification, Guid> NotificationRepo => LazyServiceProvider.GetRequiredService<IRepository<Notification, Guid>>();
}