using System.Text;
using CourseMate.API.Middlewares;
using CourseMate.Application;
using CourseMate.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
ConfigurationManager configuration = builder.Configuration;

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
builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddProblemDetails().AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

WebApplication app = builder.Build();
await app.Services.SeedAsync();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
}

app.UseExceptionHandler();
app.UseHttpsRedirection();
app.UseCors();
app.UseSwaggerUI();
app.MapOpenApi();
app.UseAuthentication();
app.UseAuthorization();
// app.MapGroup("/api/auth").MapIdentityApi<IdentityUser<Guid>>();
app.MapControllers();
await app.RunAsync();