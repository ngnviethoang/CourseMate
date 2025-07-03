using CourseMate.Entities.Books;
using CourseMate.Entities.Categories;
using CourseMate.Entities.Chapters;
using CourseMate.Entities.Courses;
using CourseMate.Entities.Enrollments;
using CourseMate.Entities.Lessons;
using CourseMate.Entities.Orders;
using CourseMate.Entities.PaymentRequests;
using CourseMate.Entities.Reviews;
using Microsoft.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore.Modeling;
using Volo.Abp.Identity;

namespace CourseMate.Data;

public static class CourseMateDbContextModelBuilderExtensions
{
    private const string DbSchema = "app";

    public static void ConfigureCourseMateEntities(this ModelBuilder builder)
    {
        builder.Entity<Book>(b =>
        {
            b.ToTable("Books", DbSchema);
            b.ConfigureByConvention();
            b.Property(x => x.Name).IsRequired().HasMaxLength(128);
        });

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
            b.HasOne<PaymentRequest>().WithOne().HasForeignKey<Order>(i => i.PaymentRequestId);
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
        });
    }
}