using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace CourseMate.Data;

public class CourseMateDbContextFactory : IDesignTimeDbContextFactory<CourseMateDbContext>
{
    public CourseMateDbContext CreateDbContext(string[] args)
    {
        // https://www.npgsql.org/efcore/release-notes/6.0.html#opting-out-of-the-new-timestamp-mapping-logic
        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

        CourseMateEfCoreEntityExtensionMappings.Configure();
        IConfigurationRoot configuration = BuildConfiguration();

        DbContextOptionsBuilder<CourseMateDbContext> builder = new DbContextOptionsBuilder<CourseMateDbContext>()
            .UseNpgsql(configuration.GetConnectionString("Default"));

        return new CourseMateDbContext(builder.Options);
    }

    private static IConfigurationRoot BuildConfiguration()
    {
        IConfigurationBuilder builder = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", false);

        return builder.Build();
    }
}