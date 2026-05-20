using System.Net.Http.Json;
using System.Text.Json.Serialization;
using CourseMate.Contracts.Options;
using Microsoft.Extensions.Options;

namespace CourseMate.Application.Services;

public record GoogleUserInfo(
    string Id,
    string Email,
    string Name,
    string? Picture);

public interface IGoogleAuthService
{
    string BuildAuthorizationUrl(string redirectUri, string state);
    Task<GoogleUserInfo> ExchangeCodeForUserInfoAsync(string code, string redirectUri, CancellationToken ct = default);
}

public class GoogleAuthService : IGoogleAuthService
{
    private const string AuthorizationEndpoint = "https://accounts.google.com/o/oauth2/v2/auth";
    private const string TokenEndpoint = "https://oauth2.googleapis.com/token";
    private const string UserInfoEndpoint = "https://www.googleapis.com/oauth2/v3/userinfo";

    private readonly GoogleAuthOptions _options;
    private readonly IHttpClientFactory _httpClientFactory;

    public GoogleAuthService(IOptions<GoogleAuthOptions> options, IHttpClientFactory httpClientFactory)
    {
        _options = options.Value;
        _httpClientFactory = httpClientFactory;
    }

    public string BuildAuthorizationUrl(string redirectUri, string state)
    {
        string[] parameters =
        [
            $"client_id={Uri.EscapeDataString(_options.ClientId)}",
            $"redirect_uri={Uri.EscapeDataString(redirectUri)}",
            "response_type=code",
            "scope=openid%20email%20profile",
            $"state={Uri.EscapeDataString(state)}",
            "access_type=online",
            "prompt=select_account"
        ];

        return $"{AuthorizationEndpoint}?{string.Join("&", parameters)}";
    }

    public async Task<GoogleUserInfo> ExchangeCodeForUserInfoAsync(string code, string redirectUri, CancellationToken ct = default)
    {
        HttpClient client = _httpClientFactory.CreateClient();

        // Exchange authorization code for tokens
        Dictionary<string, string> tokenRequest = new()
        {
            ["code"] = code,
            ["client_id"] = _options.ClientId,
            ["client_secret"] = _options.ClientSecret,
            ["redirect_uri"] = redirectUri,
            ["grant_type"] = "authorization_code"
        };

        HttpResponseMessage tokenResponse = await client.PostAsync(TokenEndpoint, new FormUrlEncodedContent(tokenRequest), ct);
        tokenResponse.EnsureSuccessStatusCode();

        GoogleTokenResponse? tokenResult = await tokenResponse.Content.ReadFromJsonAsync<GoogleTokenResponse>(ct);
        if (tokenResult is null || string.IsNullOrEmpty(tokenResult.AccessToken))
        {
            throw new InvalidOperationException("Failed to obtain access token from Google.");
        }

        // Fetch user info using access token
        HttpRequestMessage userInfoRequest = new(HttpMethod.Get, UserInfoEndpoint);
        userInfoRequest.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", tokenResult.AccessToken);

        HttpResponseMessage userInfoResponse = await client.SendAsync(userInfoRequest, ct);
        userInfoResponse.EnsureSuccessStatusCode();

        GoogleUserInfoResponse? userInfo = await userInfoResponse.Content.ReadFromJsonAsync<GoogleUserInfoResponse>(ct);
        if (userInfo is null || string.IsNullOrEmpty(userInfo.Sub))
        {
            throw new InvalidOperationException("Failed to obtain user info from Google.");
        }

        return new GoogleUserInfo(
            Id: userInfo.Sub,
            Email: userInfo.Email ?? string.Empty,
            Name: userInfo.Name ?? string.Empty,
            Picture: userInfo.Picture);
    }

    private sealed class GoogleTokenResponse
    {
        [JsonPropertyName("access_token")]
        public string AccessToken { get; set; } = string.Empty;

        [JsonPropertyName("token_type")]
        public string TokenType { get; set; } = string.Empty;

        [JsonPropertyName("expires_in")]
        public int ExpiresIn { get; set; }

        [JsonPropertyName("id_token")]
        public string? IdToken { get; set; }
    }

    private sealed class GoogleUserInfoResponse
    {
        [JsonPropertyName("sub")]
        public string Sub { get; set; } = string.Empty;

        [JsonPropertyName("email")]
        public string? Email { get; set; }

        [JsonPropertyName("name")]
        public string? Name { get; set; }

        [JsonPropertyName("picture")]
        public string? Picture { get; set; }

        [JsonPropertyName("email_verified")]
        public bool EmailVerified { get; set; }
    }
}
