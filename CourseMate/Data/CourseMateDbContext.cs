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
using Microsoft.EntityFrameworkCore;
using Volo.Abp.AuditLogging.EntityFrameworkCore;
using Volo.Abp.BackgroundJobs.EntityFrameworkCore;
using Volo.Abp.BlobStoring.Database.EntityFrameworkCore;
using Volo.Abp.DependencyInjection;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.FeatureManagement.EntityFrameworkCore;
using Volo.Abp.Identity;
using Volo.Abp.Identity.EntityFrameworkCore;
using Volo.Abp.OpenIddict.EntityFrameworkCore;
using Volo.Abp.PermissionManagement.EntityFrameworkCore;
using Volo.Abp.SettingManagement.EntityFrameworkCore;

namespace CourseMate.Data;

[ReplaceDbContext(typeof(IIdentityDbContext))]
public class CourseMateDbContext : AbpDbContext<CourseMateDbContext>, IIdentityDbContext
{
    public CourseMateDbContext(DbContextOptions<CourseMateDbContext> options)
        : base(options)
    {
    }

    public DbSet<Category> Categories { get; set; }
    public DbSet<Chapter> Chapters { get; set; }
    public DbSet<Course> Courses { get; set; }
    public DbSet<Enrollment> Enrollments { get; set; }
    public DbSet<Lesson> Lessons { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<PaymentRequest> PaymentRequests { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<UserProgress> UserProgresses { get; set; }
    public DbSet<Cart> Carts { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ConfigureSettingManagement();
        builder.ConfigureBackgroundJobs();
        builder.ConfigureAuditLogging();
        builder.ConfigureFeatureManagement();
        builder.ConfigurePermissionManagement();
        builder.ConfigureBlobStoring();
        builder.ConfigureIdentity();
        builder.ConfigureOpenIddict();
        builder.ConfigureCourseMateEntities();
    }

    public DbSet<IdentityUser> Users { get; set; }
    public DbSet<IdentityRole> Roles { get; set; }
    public DbSet<IdentityClaimType> ClaimTypes { get; set; }
    public DbSet<OrganizationUnit> OrganizationUnits { get; set; }
    public DbSet<IdentitySecurityLog> SecurityLogs { get; set; }
    public DbSet<IdentityLinkUser> LinkUsers { get; set; }
    public DbSet<IdentityUserDelegation> UserDelegations { get; set; }
    public DbSet<IdentitySession> Sessions { get; set; }
}