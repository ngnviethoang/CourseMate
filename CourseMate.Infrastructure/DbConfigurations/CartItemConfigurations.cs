using CourseMate.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Infrastructure.DbConfigurations;

public class CartItemConfigurations : IEntityTypeConfiguration<CartItem>
{
    public void Configure(EntityTypeBuilder<CartItem> builder)
    {
        builder.ToTable("CartItems");
        builder.HasOne<Cart>().WithMany().HasForeignKey(i => i.CartId);
        builder.HasOne<Course>().WithMany().HasForeignKey(i => i.CourseId);
    }
}