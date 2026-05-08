using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;

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
}