using CourseMate.API.Middlewares;
using CourseMate.Application;
using CourseMate.Core;
using Microsoft.AspNetCore.Identity;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
ConfigurationManager configuration = builder.Configuration;

builder.Services.AddIdentityApiEndpoints<IdentityUser<Guid>>().AddEntityFrameworkStores<CourseMateDbContext>();
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
app.MapGroup("/api/auth").MapIdentityApi<IdentityUser<Guid>>();
app.MapControllers();
app.Run();