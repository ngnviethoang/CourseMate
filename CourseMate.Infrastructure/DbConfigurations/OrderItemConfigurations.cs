using CourseMate.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Core.DbConfigurations;

public class OrderItemConfigurations : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        builder.ToTable("OrderItems");
        builder.HasOne<Order>().WithMany().HasForeignKey(i => i.OrderId);
        builder.HasOne<Course>().WithMany().HasForeignKey(i => i.CourseId);
    }
}