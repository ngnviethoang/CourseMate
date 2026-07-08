using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder.ToTable("Notifications");
        builder.Property(i => i.Title).HasColumnType("citext");
        builder.Property(i => i.Message).HasColumnType("citext");
        builder.HasOne<User>().WithMany().HasForeignKey(i => i.ReceiverId);
    }
}