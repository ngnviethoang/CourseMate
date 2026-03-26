using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using CourseMate.API.Middlewares;
using CourseMate.Application;
using CourseMate.Contracts.Options;
using CourseMate.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
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

    builder.Services.Configure<StorageOptions>(configuration.GetSection("Storage"));
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
    builder.Services.AddInfrastructure(configuration.GetConnectionString("CourseMate") ?? string.Empty);
    builder.Services.AddControllers().AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
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
        string[] allowedHosts = builder.Configuration["AllowedHosts"]!.ToLower().Trim().Split(',', StringSplitOptions.RemoveEmptyEntries);
        options.AddPolicy("CorsPolicy", policy =>
        {
            policy.WithOrigins(allowedHosts)
                .SetIsOriginAllowedToAllowWildcardSubdomains()
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
    });

    WebApplication app = builder.Build();
    // await app.Services.SeedAsync();
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseExceptionHandler();
    app.UseHttpsRedirection();
    app.UseCors("CorsPolicy");
    app.UseAuthentication();
    app.UseAuthorization();
    app.UseMiddleware<HttpLoggingMiddleware>();
    // app.MapGroup("/api/auth").MapIdentityApi<IdentityUser<Guid>>();
    app.MapControllers();

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