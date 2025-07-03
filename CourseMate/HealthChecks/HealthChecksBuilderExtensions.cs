using HealthChecks.UI.Client;
using HealthChecks.UI.Configuration;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;

namespace CourseMate.HealthChecks;

public static class HealthChecksBuilderExtensions
{
    public static void AddCourseMateHealthChecks(this IServiceCollection services)
    {
        // Add your health checks here
        IHealthChecksBuilder healthChecksBuilder = services.AddHealthChecks();
        healthChecksBuilder.AddCheck<CourseMateDatabaseCheck>("CourseMate DbContext Check", tags: new[] { "database" });

        IConfiguration configuration = services.GetConfiguration();
        string? healthCheckUrl = configuration["App:HealthCheckUrl"];

        if (string.IsNullOrEmpty(healthCheckUrl))
        {
            healthCheckUrl = "/health-status";
        }

        services.ConfigureHealthCheckEndpoint("/health-status");

        HealthChecksUIBuilder healthChecksUiBuilder = services.AddHealthChecksUI(settings => { settings.AddHealthCheckEndpoint("CourseMate Health Status", healthCheckUrl); });

        // Set your HealthCheck UI Storage here
        healthChecksUiBuilder.AddInMemoryStorage();

        services.MapHealthChecksUiEndpoints(options =>
        {
            options.UIPath = "/health-ui";
            options.ApiPath = "/health-api";
        });
    }

    private static IServiceCollection ConfigureHealthCheckEndpoint(this IServiceCollection services, string path)
    {
        services.Configure<AbpEndpointRouterOptions>(options =>
        {
            options.EndpointConfigureActions.Add(endpointContext =>
            {
                endpointContext.Endpoints.MapHealthChecks(
                    new PathString(path.EnsureStartsWith('/')),
                    new HealthCheckOptions
                    {
                        Predicate = _ => true,
                        ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse,
                        AllowCachingResponses = false
                    });
            });
        });

        return services;
    }

    private static IServiceCollection MapHealthChecksUiEndpoints(this IServiceCollection services, Action<Options>? setupOption = null)
    {
        services.Configure<AbpEndpointRouterOptions>(routerOptions => { routerOptions.EndpointConfigureActions.Add(endpointContext => { endpointContext.Endpoints.MapHealthChecksUI(setupOption); }); });

        return services;
    }
}