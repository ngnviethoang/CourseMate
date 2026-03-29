using Hangfire;
using Hangfire.PostgreSql;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace CourseMate.Persistent;

public static class InfrastructureExtensions
{
    extension(IServiceCollection services)
    {
        public IServiceCollection AddInfrastructure(string courseMateConnection)
        {
            // https://www.npgsql.org/efcore/release-notes/6.0.html#opting-out-of-the-new-timestamp-mapping-logic
            AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

            services.AddDbContextPool<CourseMateDbContext>(options => options.UseNpgsql(courseMateConnection, o => o.UseVector()));

            services.AddDbContextPool<CourseMateReadOnlyDbContext>(options =>
            {
                options.UseNpgsql(courseMateConnection, o => o.UseVector());
                options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
            });

            services.AddHangfire(configuration => configuration.UsePostgreSqlStorage(options => options.UseNpgsqlConnection(courseMateConnection)));
            return services;
        }
    }
}