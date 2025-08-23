using CourseMate.Data;
using CourseMate.ServiceDefaults;
using Serilog;
using Serilog.Events;
using Volo.Abp.Data;

namespace CourseMate;

public class Program
{
    public static async Task<int> Main(string[] args)
    {
        Log.Logger = new LoggerConfiguration()
            .WriteTo.Async(c => c.File("Logs/logs.txt"))
            .WriteTo.Async(c => c.Console())
            .CreateBootstrapLogger();

        // https://www.npgsql.org/efcore/release-notes/6.0.html#opting-out-of-the-new-timestamp-mapping-logic
        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
        try
        {
            WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

            builder.AddServiceDefaults();

            builder.Host.AddAppSettingsSecretsJson()
                .UseAutofac()
                .UseSerilog((context, services, loggerConfiguration) =>
                {
                    if (IsMigrateDatabase(args))
                    {
                        loggerConfiguration
                            .MinimumLevel.Override("Volo.Abp", LogEventLevel.Warning)
                            .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
                            .WriteTo.Async(c => c.Console(standardErrorFromLevel: LogEventLevel.Error));
                    }
                    else
                    {
                        loggerConfiguration
#if DEBUG
                            .MinimumLevel.Debug()
#else
                            .MinimumLevel.Information()
#endif
                            .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
                            .MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Warning)
                            .Enrich.FromLogContext()
                            .WriteTo.Async(c => c.File("Logs/logs.txt"))
                            .WriteTo.Async(c => c.Console())
                            .WriteTo.Async(c => c.AbpStudio(services));
                    }
                });
            if (IsMigrateDatabase(args))
            {
                builder.Services.AddDataMigrationEnvironment();
            }

            await builder.AddApplicationAsync<CourseMateModule>();
            WebApplication app = builder.Build();
            await app.InitializeApplicationAsync();

            if (IsMigrateDatabase(args))
            {
                await app.Services.GetRequiredService<CourseMateDbMigrationService>().MigrateAsync();
                ConsoleColor previous = Console.ForegroundColor;
                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine("Migration completed.");
                Console.ForegroundColor = previous;
                return 0;
            }

            Log.Information("Starting CourseMate.");
            await app.RunAsync();
            return 0;
        }
        catch (Exception ex)
        {
            if (ex is HostAbortedException)
            {
                throw;
            }

            Log.Fatal(ex, "CourseMate terminated unexpectedly!");
            return 1;
        }
        finally
        {
            Log.CloseAndFlush();
        }
    }

    private static bool IsMigrateDatabase(string[] args)
    {
        // return true;
        return args.Any(x => x.Contains("--migrate-database", StringComparison.OrdinalIgnoreCase));
    }
}