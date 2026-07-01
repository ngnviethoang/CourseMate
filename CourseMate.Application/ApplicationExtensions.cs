using CourseMate.Application.Services.RecommendationServices;
using Microsoft.Extensions.DependencyInjection;

namespace CourseMate.Application;

public static class ApplicationExtensions
{
    extension(IServiceCollection services)
    {
        public IServiceCollection AddApplication()
        {
            services.AddMediatR(cfg =>
            {
                cfg.LicenseKey = "PLACEHOLDER_MEDIATR_LICENSE_KEY";
                cfg.RegisterServicesFromAssembly(AssemblyReference.Assembly);
                cfg.AddOpenBehavior(typeof(Behaviors.LoggingBehavior<,>));
                cfg.AddOpenBehavior(typeof(Behaviors.TransactionPipelineBehavior<,>));
            });
            services.AddTransient<Services.AIServices.IAiService, Services.AIServices.GeminiService>();
            services.AddTransient<Services.CodeRunnerServices.ICodeRunnerService, Services.CodeRunnerServices.OnlineCompilerService>();
            services.AddTransient<Services.FileStorageServices.IFileStorageManager, Services.FileStorageServices.LocalFileStorageManager>();

            services.AddScoped<IRecommendationService, RecommendationService>();
            services.AddScoped<IRecommendationAnalyticsService, RecommendationAnalyticsService>();
            services.AddScoped<IRecommendationSignalCollector, RecommendationSignalCollector>();
            services.AddScoped<IRecommendationScorer, RecommendationScorer>();
            services.AddScoped<IRecommendationCourseCatalog, RecommendationCourseCatalog>();
            services.AddSingleton<IRecommendationLogger, NoopRecommendationLogger>();

            return services;
        }
    }
}
