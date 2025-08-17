using CourseMate.Entities.Carts;
using CourseMate.Entities.Categories;
using CourseMate.Entities.Chapters;
using CourseMate.Entities.CodingSubmissions;
using CourseMate.Entities.Courses;
using CourseMate.Entities.Enrollments;
using CourseMate.Entities.Lessons;
using CourseMate.Entities.Lessons.Articles;
using CourseMate.Entities.Lessons.CodingExercises;
using CourseMate.Entities.Lessons.Quizzes;
using CourseMate.Entities.Lessons.Videos;
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
        builder.Entity<Cart>(b =>
        {
            b.ToTable("Carts", DbSchema);
            b.ConfigureByConvention();
            b.HasOne<IdentityUser>().WithMany().HasForeignKey(i => i.UserId).IsRequired();
            b.HasOne<Course>().WithMany().HasForeignKey(i => i.CourseId).IsRequired();
        });

        builder.Entity<Category>(b =>
        {
            b.ToTable("Categories", DbSchema);
            b.ConfigureByConvention();
        });

        builder.Entity<Chapter>(b =>
        {
            b.ToTable("Chapters", DbSchema);
            b.ConfigureByConvention();
            b.HasOne<Course>().WithMany().HasForeignKey(i => i.CourseId).IsRequired();
        });

        builder.Entity<CodingSubmission>(b =>
        {
            b.ToTable("CodingSubmissions", DbSchema);
            b.ConfigureByConvention();
            b.HasOne<CodingExercise>().WithMany().HasForeignKey(i => i.CodingExerciseId).IsRequired();
            b.HasOne<IdentityUser>().WithMany().HasForeignKey(i => i.UserId).IsRequired();
        });

        builder.Entity<TestCaseSubmission>(b =>
        {
            b.ToTable("TestCaseSubmissions", DbSchema);
            b.ConfigureByConvention();
            b.HasOne<CodingSubmission>().WithMany().HasForeignKey(i => i.CodingSubmissionId).IsRequired();
            b.HasOne<TestCase>().WithMany().HasForeignKey(i => i.TestCaseId).IsRequired();
        });

        builder.Entity<Course>(b =>
        {
            b.ToTable("Courses", DbSchema);
            b.ConfigureByConvention();
            b.HasOne<IdentityUser>().WithMany().HasForeignKey(i => i.InstructorId).IsRequired();
            b.HasOne<Category>().WithMany().HasForeignKey(i => i.CategoryId).IsRequired();
        });

        builder.Entity<Enrollment>(b =>
        {
            b.ToTable("Enrollments", DbSchema);
            b.ConfigureByConvention();
            b.HasOne<Course>().WithMany().HasForeignKey(i => i.CourseId).IsRequired();
            b.HasOne<IdentityUser>().WithMany().HasForeignKey(i => i.StudentId).IsRequired();
        });

        builder.Entity<Lesson>(b =>
        {
            b.ToTable("Lessons", DbSchema);
            b.ConfigureByConvention();
            b.HasOne<Chapter>().WithMany().HasForeignKey(i => i.ChapterId).IsRequired();
        });

        builder.Entity<Article>(b =>
        {
            b.ToTable("Articles", DbSchema);
            b.ConfigureByConvention();
            b.HasOne<Lesson>().WithOne().HasForeignKey<Article>(i => i.LessonId).IsRequired();
        });

        builder.Entity<CodingExercise>(b =>
        {
            b.ToTable("CodingExercises", DbSchema);
            b.ConfigureByConvention();
            b.HasOne<Lesson>().WithOne().HasForeignKey<CodingExercise>(i => i.LessonId).IsRequired();
        });

        builder.Entity<SampleCode>(b =>
        {
            b.ToTable("SampleCodes", DbSchema);
            b.ConfigureByConvention();
            b.HasOne<CodingExercise>().WithMany().HasForeignKey(i => i.CodingExerciseId).IsRequired();
        });

        builder.Entity<TestCase>(b =>
        {
            b.ToTable("TestCases", DbSchema);
            b.ConfigureByConvention();
            b.HasOne<CodingExercise>().WithMany().HasForeignKey(i => i.CodingExerciseId).IsRequired();
        });

        builder.Entity<QuizOption>(b =>
        {
            b.ToTable("QuizOptions", DbSchema);
            b.ConfigureByConvention();
            b.HasOne<QuizQuestion>().WithMany().HasForeignKey(i => i.QuizQuestionId).IsRequired();
        });

        builder.Entity<QuizQuestion>(b =>
        {
            b.ToTable("QuizQuestions", DbSchema);
            b.ConfigureByConvention();
            b.HasOne<Lesson>().WithOne().HasForeignKey<QuizQuestion>(i => i.LessonId).IsRequired();
        });

        builder.Entity<Video>(b =>
        {
            b.ToTable("Video", DbSchema);
            b.ConfigureByConvention();
            b.HasOne<Lesson>().WithOne().HasForeignKey<Video>(i => i.LessonId).IsRequired();
        });

        builder.Entity<Notification>(b =>
        {
            b.ToTable("Notifications", DbSchema);
            b.ConfigureByConvention();
            b.HasOne<IdentityUser>().WithMany().HasForeignKey(i => i.ReceiverUserId);
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

        builder.Entity<UserProgress>(b =>
        {
            b.ToTable("UserProgresses", DbSchema);
            b.ConfigureByConvention();
            b.HasOne<IdentityUser>().WithMany().HasForeignKey(i => i.UserId).IsRequired();
            b.HasOne<Lesson>().WithMany().HasForeignKey(i => i.LessonId).IsRequired();
        });
    }
}