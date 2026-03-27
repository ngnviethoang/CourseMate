using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.ToTable("Payments");
        builder.Property(i => i.Provider).HasColumnType("citext").IsRequired();
        builder.Property(i => i.TransactionId).HasColumnType("citext").IsRequired();
        builder.HasOne<Order>().WithOne().HasForeignKey<Payment>(i => i.OrderId);
    }
}