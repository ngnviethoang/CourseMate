using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

public class PaymentConfiguration : IEntityTypeConfiguration<PaymentTransaction>
{
    public void Configure(EntityTypeBuilder<PaymentTransaction> builder)
    {
        builder.ToTable("PaymentTransactions");
        builder.Property(i => i.Provider).HasColumnType("citext").IsRequired();
        builder.Property(i => i.TransactionId).HasColumnType("citext").IsRequired();
        builder.HasOne<Order>().WithOne().HasForeignKey<PaymentTransaction>(i => i.OrderId);
    }
}