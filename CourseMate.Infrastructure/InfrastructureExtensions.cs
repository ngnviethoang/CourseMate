using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace CourseMate.Core;

public static class InfrastructureExtensions
{
    extension(IServiceCollection services)
    {
        public IServiceCollection AddInfrastructure(string connectionString)
        {
            services.AddDbContextPool<CourseMateDbContext>(options => options.UseNpgsql(connectionString));
            services.AddDbContextPool<CourseMateReadOnlyDbContext>(options =>
            {
                options.UseNpgsql(connectionString);
                options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
            });
            services.AddHttpContextAccessor();
            return services;
        }
    }
}