using CourseMate.Persistent.Entities;
using CourseMate.Persistent.Entities.Abstracts;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using System.Linq.Expressions;

namespace CourseMate.Persistent;

public sealed class CourseMateReadOnlyDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
{
    private const string SoftDeletionFilter = "SoftDeletionFilter";

    public CourseMateReadOnlyDbContext(DbContextOptions<CourseMateReadOnlyDbContext> options) : base(options)
    {
    }

    public DbSet<Category> Categories { get; set; }
    public DbSet<Course> Courses { get; set; }
    public DbSet<Chapter> Chapters { get; set; }
    public DbSet<Lesson> Lessons { get; set; }
    public DbSet<LessonVideo> LessonVideos { get; set; }
    public DbSet<LessonReading> LessonReadings { get; set; }
    public DbSet<LessonCoding> LessonCodings { get; set; }
    public DbSet<LessonQuiz> LessonQuizzes { get; set; }
    public DbSet<LessonQuizQuestion> LessonQuizQuestions { get; set; }
    public DbSet<LessonQuizAnswer> LessonQuizAnswers { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<PaymentTransaction> PaymentTransactions { get; set; }
    public DbSet<Enrollment> Enrollments { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<Cart> Carts { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<UserLessonProgress> UserLessonProgresses { get; set; }
    public DbSet<FileEntry> FileEntries { get; set; }
    public DbSet<FileChunk> FileChunks { get; set; }
    public DbSet<FileEntryEmbedding> FileEntryEmbeddings { get; set; }
    public DbSet<LessonMaterial> LessonMaterials { get; set; }
    public DbSet<Exercise> Exercises { get; set; }
    public DbSet<ExerciseExample> ExerciseExamples { get; set; }
    public DbSet<ExerciseTestCase> ExerciseTestCases { get; set; }
    public DbSet<ExerciseDefaultCode> ExerciseDefaultCodes { get; set; }
    public DbSet<ExerciseSubmission> ExerciseSubmissions { get; set; }
    public DbSet<Contest> Contests { get; set; }
    public DbSet<ContestExercise> ContestExercises { get; set; }
    public DbSet<ContestRegistration> ContestRegistrations { get; set; }
    public DbSet<ContestSubmission> ContestSubmissions { get; set; }
    public DbSet<AntiCheatViolation> AntiCheatViolations { get; set; }
    public DbSet<ContestPrize> ContestPrizes { get; set; }

    // Recommendation system
    public DbSet<StudentPreference> StudentPreferences { get; set; }
    public DbSet<StudentSkillProfile> StudentSkillProfiles { get; set; }
    public DbSet<RecommendationLog> RecommendationLogs { get; set; }
    public DbSet<CourseEmbedding> CourseEmbeddings { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AssemblyReference).Assembly);

        foreach (IMutableEntityType entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(ISoftDelete).IsAssignableFrom(entityType.ClrType))
            {
                ParameterExpression parameter = Expression.Parameter(entityType.ClrType, "i");
                MemberExpression isDeletedProperty = Expression.Property(parameter, nameof(ISoftDelete.IsDeleted));
                UnaryExpression notIsDeleted = Expression.Not(isDeletedProperty);
                LambdaExpression lambda = Expression.Lambda(notIsDeleted, parameter);
                modelBuilder.Entity(entityType.ClrType).HasQueryFilter(SoftDeletionFilter, lambda);
            }
        }
    }

    public override int SaveChanges()
    {
        throw new InvalidOperationException("This DbContext is read-only.");
    }

    public override int SaveChanges(bool acceptAllChangesOnSuccess)
    {
        throw new InvalidOperationException("This DbContext is read-only.");
    }

    public override Task<int> SaveChangesAsync(CancellationToken ct = default)
    {
        throw new InvalidOperationException("This DbContext is read-only.");
    }

    public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken ct = default)
    {
        throw new InvalidOperationException("This DbContext is read-only.");
    }
}