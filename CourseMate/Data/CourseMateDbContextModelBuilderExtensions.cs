using CourseMate.Entities.Carts;
using CourseMate.Entities.Categories;
using CourseMate.Entities.Chapters;
using CourseMate.Entities.Courses;
using CourseMate.Entities.Enrollments;
using CourseMate.Entities.Lessons;
using CourseMate.Entities.Notifications;
using CourseMate.Entities.Orders;
using CourseMate.Entities.PaymentRequests;
using CourseMate.Entities.Reviews;
using CourseMate.Entities.UserProgresses;
using CourseMate.Entities.VideoProgresses;
using Microsoft.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore.Modeling;
using Volo.Abp.Identity;

namespace CourseMate.Data;

public static class CourseMateDbContextModelBuilderExtensions
{
    private const string DbSchema = "app";

    public static void ConfigureCourseMateEntities(this ModelBuilder builder)
    {
        builder.Entity<Course>(b =>
        {
            b.ToTable("Courses", DbSchema);
            b.ConfigureByConvention();
            b.HasOne<IdentityUser>().WithMany().HasForeignKey(i => i.InstructorId).IsRequired();
            b.HasOne<Category>().WithMany().HasForeignKey(i => i.CategoryId).IsRequired();
        });

        builder.Entity<Chapter>(b =>
        {
            b.ToTable("Chapters", DbSchema);
            b.ConfigureByConvention();
            b.HasOne<Course>().WithMany().HasForeignKey(i => i.CourseId).IsRequired();
        });

        builder.Entity<Lesson>(b =>
        {
            b.ToTable("Lessons", DbSchema);
            b.ConfigureByConvention();
            b.HasOne<Chapter>().WithMany().HasForeignKey(i => i.ChapterId).IsRequired();
        });

        builder.Entity<TestCase>(b =>
        {
            b.ToTable("TestCases", DbSchema);
            b.ConfigureByConvention();
            b.HasOne<Lesson>().WithMany().HasForeignKey(i => i.LessonId).IsRequired();
        });

        builder.Entity<Category>(b =>
        {
            b.ToTable("Categories", DbSchema);
            b.ConfigureByConvention();
        });

        builder.Entity<Enrollment>(b =>
        {
            b.ToTable("Enrollments", DbSchema);
            b.ConfigureByConvention();
            b.HasOne<Course>().WithMany().HasForeignKey(i => i.CourseId).IsRequired();
            b.HasOne<IdentityUser>().WithMany().HasForeignKey(i => i.StudentId).IsRequired();
        });

        builder.Entity<Review>(b =>
        {
            b.ToTable("Reviews", DbSchema);
            b.ConfigureByConvention();
            b.HasOne<Course>().WithMany().HasForeignKey(i => i.CourseId).IsRequired();
            b.HasOne<IdentityUser>().WithMany().HasForeignKey(i => i.StudentId).IsRequired();
        });

        builder.Entity<Order>(b =>
        {
            b.ToTable("Orders", DbSchema);
            b.ConfigureByConvention();
            b.HasOne<IdentityUser>().WithMany().HasForeignKey(i => i.StudentId).IsRequired();
        });

        builder.Entity<OrderItem>(b =>
        {
            b.ToTable("OrderItems", DbSchema);
            b.ConfigureByConvention();
            b.HasOne<Order>().WithMany().HasForeignKey(i => i.OrderId).IsRequired();
            b.HasOne<Course>().WithMany().HasForeignKey(i => i.CourseId).IsRequired();
        });

        builder.Entity<PaymentRequest>(b =>
        {
            b.ToTable("PaymentRequests", DbSchema);
            b.ConfigureByConvention();
            b.HasOne<Order>().WithMany().HasForeignKey(i => i.OrderId);
        });

        builder.Entity<VideoProgress>(b =>
        {
            b.ToTable("VideoProgresses", DbSchema);
            b.ConfigureByConvention();
            b.HasOne<Lesson>().WithOne().HasForeignKey<VideoProgress>(i => i.LessonId).IsRequired();
            b.HasOne<IdentityUser>().WithMany().HasForeignKey(i => i.UserId).IsRequired();
        });

        builder.Entity<Notification>(b =>
        {
            b.ToTable("Notifications", DbSchema);
            b.ConfigureByConvention();
        });

        builder.Entity<UserProgress>(b =>
        {
            b.ToTable("UserProgresses", DbSchema);
            b.ConfigureByConvention();
            b.HasOne<IdentityUser>().WithMany().HasForeignKey(i => i.UserId).IsRequired();
            b.HasOne<Lesson>().WithMany().HasForeignKey(i => i.LessonId).IsRequired();
        });

        builder.Entity<Cart>(b =>
        {
            b.ToTable("Carts", DbSchema);
            b.ConfigureByConvention();
            b.HasOne<IdentityUser>().WithMany().HasForeignKey(i => i.UserId).IsRequired();
            b.HasOne<Course>().WithMany().HasForeignKey(i => i.CourseId).IsRequired();
        });
    }
}