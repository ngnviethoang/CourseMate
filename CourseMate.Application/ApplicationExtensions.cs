using CourseMate.Application.Behaviors;
using CourseMate.Application.Services.AI;
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
                cfg.LicenseKey = "eyJhbGciOiJSUzI1NiIsImtpZCI6Ikx1Y2t5UGVubnlTb2Z0d2FyZUxpY2Vuc2VLZXkvYmJiMTNhY2I1OTkwNGQ4OWI0Y2IxYzg1ZjA4OGNjZjkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2x1Y2t5cGVubnlzb2Z0d2FyZS5jb20iLCJhdWQiOiJMdWNreVBlbm55U29mdHdhcmUiLCJleHAiOiIxODA1MDY4ODAwIiwiaWF0IjoiMTc3MzU2MTUzNSIsImFjY291bnRfaWQiOiIwMTljZjA4MTFjYzc3MTA4OGI2NmRjZGRkYWM1OTQ0OSIsImN1c3RvbWVyX2lkIjoiY3RtXzAxa2tyODJwazhzaHRjOHlkcmZuajZzZmVhIiwic3ViX2lkIjoiLSIsImVkaXRpb24iOiIwIiwidHlwZSI6IjIifQ.QS7uLFWTwT-YvDXGIpzCIUGkZk9fI3OjXMPPZSGyhOJ6Rio3Tj9ufRlHF-DBNGEQTJpV9RIP-fZ3wz6jKz1seJTiv0T8t1OogSUKzSNKsyczJ4uksqfh4BZoDwbrZ_HVMsegIlugY3PDbOiZ-zRGzZbhv_MstR5AfjSzTgIYIO_atdy9kfZ7OSe3V9fSjme1CLeXFGqPJB5ctajCZ1Z1W-IpuUUnA5mRUjpE9ojjbiPAoqxrKKP1200uyQ2GjdXrgOD9cSBlK75FDDJAsxT3EevxBO95BcFfHEz9gmM4o3Nvj89hgEiJkXhobT4-2rmX1ai-bKRfUooU67ziHn7EjQ";
                cfg.RegisterServicesFromAssembly(AssemblyReference.Assembly);
                cfg.AddOpenBehavior(typeof(LoggingBehavior<,>));
                cfg.AddOpenBehavior(typeof(TransactionPipelineBehavior<,>));
            });

            services.AddTransient<IAiService, GoogleAiService>();
            services.AddHttpClient<IAIGenerationService, AIGenerationService>();

            return services;
        }
    }
}