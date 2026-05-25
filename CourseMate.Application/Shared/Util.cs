using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Primitives;
using Microsoft.IdentityModel.Tokens;

namespace CourseMate.Application.Shared;

public static class Util
{
    public static string HmacSha512(string key, string inputData)
    {
        StringBuilder hash = new();
        byte[] keyBytes = Encoding.UTF8.GetBytes(key);
        byte[] inputBytes = Encoding.UTF8.GetBytes(inputData);
        using (HMACSHA512 hmac = new(keyBytes))
        {
            byte[] hashValue = hmac.ComputeHash(inputBytes);
            foreach (byte theByte in hashValue)
            {
                hash.Append(theByte.ToString("x2"));
            }
        }

        return hash.ToString();
    }

    public static string GetIpAddress(HttpContext httpContext)
    {
        string ipAddress = string.Empty;

        if (httpContext.Request.Headers.TryGetValue("X-Forwarded-For", out StringValues ipAddresses))
        {
            ipAddress = ipAddresses.FirstOrDefault() ?? string.Empty;
        }

        if (string.IsNullOrEmpty(ipAddress))
        {
            string? remoteIpAddress = httpContext.Connection.RemoteIpAddress?.ToString();
            if (string.IsNullOrEmpty(remoteIpAddress) || string.Equals(remoteIpAddress, "::1", StringComparison.InvariantCultureIgnoreCase))
            {
                ipAddress = "127.0.0.1";
            }
            else
            {
                ipAddress = remoteIpAddress;
            }
        }

        return ipAddress;
    }

    public static string CreateDirectoryIfNotExist(string path)
    {
        if (!Directory.Exists(path))
        {
            Directory.CreateDirectory(path);
        }

        return path;
    }

    public static string GenerateJwtToken(IConfiguration configuration, Guid userId, string userName, string email, IEnumerable<string> roles)
    {
        ICollection<Claim> claims =
        [
            new(ClaimTypes.Name, userName),
            new(ClaimTypes.NameIdentifier, userId.ToString()),
            new(ClaimTypes.Email, email)
        ];

        foreach (string role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        SymmetricSecurityKey key = new(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!));
        SigningCredentials credentials = new(key, SecurityAlgorithms.HmacSha256);

        JwtSecurityToken token = new(
            configuration["Jwt:Issuer"],
            configuration["Jwt:Audience"],
            claims,
            expires: DateTime.Now.AddMinutes(configuration.GetValue<int>("Jwt:ExpiryMinutes")),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public static string ResolveEmailTemplatePath(string templateFileName)
    {
        string? assemblyDirectory = Directory.GetParent(AssemblyReference.Assembly.Location)?.FullName;
        if (string.IsNullOrWhiteSpace(assemblyDirectory))
        {
            throw new DirectoryNotFoundException("Could not resolve assembly directory.");
        }

        string templatePath = Path.Combine(assemblyDirectory, "EmailTemplates", templateFileName);
        if (File.Exists(templatePath))
        {
            return templatePath;
        }

        throw new FileNotFoundException($"Email template '{templateFileName}' was not found at path '{templatePath}'.");
    }
}