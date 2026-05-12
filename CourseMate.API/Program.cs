using System.Text;
using CourseMate.API.Hubs;
using CourseMate.API.Middlewares;
using CourseMate.API.Services;
using CourseMate.Application;
using CourseMate.Application.Services.NotificationServices;
using CourseMate.Application.Shared;
using CourseMate.Contracts.Options;
using CourseMate.Persistent;
using Hangfire;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Primitives;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using Serilog;
using AssemblyReference = CourseMate.API.AssemblyReference;

try
{
    WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
    ConfigurationManager configuration = builder.Configuration;

    Log.Logger = new LoggerConfiguration().ReadFrom
        .Configuration(configuration)
        .CreateLogger();
    builder.Host.UseSerilog();

    AppSettings appSettings = new();
    configuration.Bind(appSettings);
    Util.CreateDirectoryIfNotExist(appSettings.Storage.TempPath);
    Util.CreateDirectoryIfNotExist(appSettings.Storage.PublicPath);
    builder.Services.Configure<StorageOptions>(configuration.GetSection("Storage"));
    builder.Services.Configure<StorageOptions>(configuration.GetSection("Storage"));
    builder.Services.Configure<GoogleAiOptions>(configuration.GetSection("GoogleAi"));
    builder.Services.Configure<OllamaOptions>(configuration.GetSection("Ollama"));
    builder.Services.Configure<OnlineCompilerOptions>(configuration.GetSection("OnlineCompiler"));
    builder.Services.Configure<PayOsOptions>(configuration.GetSection("PayOs"));
    builder.Services.Configure<CorsOptions>(configuration.GetSection("CORS"));
    builder.Services.Configure<SmtpOptions>(configuration.GetSection("Smtp"));
    builder.Services.AddHttpClient();
    builder.Services.AddHttpContextAccessor();
    builder.Services.AddScoped<HttpLoggingMiddleware>();
    builder.Services.AddAuthorization();
    builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = configuration["Jwt:Issuer"],
                ValidAudience = configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!))
            };
            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    StringValues accessToken = context.Request.Query["access_token"];
                    PathString path = context.HttpContext.Request.Path;
                    if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs/notification"))
                    {
                        context.Token = accessToken;
                    }

                    return Task.CompletedTask;
                }
            };
        });

    builder.Services.AddIdentityCore<IdentityUser<Guid>>()
        .AddSignInManager()
        .AddRoles<IdentityRole<Guid>>()
        .AddEntityFrameworkStores<CourseMateDbContext>();
    builder.Services.Configure<IdentityOptions>(options =>
    {
        options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-";
        options.User.RequireUniqueEmail = true;
    });
    builder.Services.AddApplication();
    builder.Services.AddInfrastructure(configuration.GetConnectionString("CourseMate")!);
    builder.Services.AddHangfireServer();
    builder.Services.AddSignalR();
    builder.Services.AddTransient<INotificationService, NotificationService>();
    builder.Services.AddControllers().AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
        options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
        options.SerializerSettings.Converters.Add(new StringEnumConverter());
    });
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(options =>
    {
        string xmlFile = $"{AssemblyReference.Assembly.GetName().Name}.xml";
        string xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
        options.IncludeXmlComments(xmlPath);
        options.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme, new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            Scheme = JwtBearerDefaults.AuthenticationScheme,
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description = "JWT Authorization header"
        });

        options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
        {
            [new OpenApiSecuritySchemeReference(JwtBearerDefaults.AuthenticationScheme, document)] = []
        });

        options.DescribeAllParametersInCamelCase();
        options.CustomSchemaIds(x => x.FullName);
    });

    builder.Services.AddProblemDetails().AddExceptionHandler<GlobalExceptionHandler>();
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowAnyOrigin", policy =>
        {
            policy.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
        });

        options.AddPolicy("SignalRHubs", policyBuilder => policyBuilder
            .WithOrigins(appSettings.Cors.AllowedOrigins)
            .AllowAnyHeader()
            .WithMethods("GET", "POST")
            .AllowCredentials());
    });

    WebApplication app = builder.Build();
    // await app.Services.SeedAsync();
    app.UseHsts();
    app.UseHttpsRedirection();
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(appSettings.Storage.PublicPath),
        RequestPath = appSettings.Storage.StaticRequestPath
    });
    app.UseCors("AllowAnyOrigin");
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseExceptionHandler();
    app.UseHttpsRedirection();
    app.UseAuthentication();
    app.UseAuthorization();
    app.UseMiddleware<HttpLoggingMiddleware>();
    // app.MapGroup("/api/auth").MapIdentityApi<IdentityUser<Guid>>();
    app.MapControllers();
    app.MapHub<NotificationHub>("/hubs/notification").RequireCors("SignalRHubs");
    app.MapHangfireDashboard();
    Log.Information("Starting web host");
    await app.RunAsync();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Host terminated unexpectedly");
    throw;
}
finally
{
    await Log.CloseAndFlushAsync();
}