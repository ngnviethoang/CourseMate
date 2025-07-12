using Microsoft.Extensions.Localization;
using OpenIddict.Abstractions;
using Volo.Abp;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.OpenIddict.Applications;
using Volo.Abp.PermissionManagement;
using Volo.Abp.Uow;

namespace CourseMate.Data;

/* Creates initial data that is needed to property run the application
 * and make client-to-server communication possible.
 */
public class OpenIddictDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private readonly IOpenIddictApplicationManager _applicationManager;
    private readonly IConfiguration _configuration;
    private readonly IPermissionDataSeeder _permissionDataSeeder;
    private readonly IOpenIddictScopeManager _scopeManager;
    private readonly IStringLocalizer<OpenIddictResponse> L;

    public OpenIddictDataSeedContributor(
        IConfiguration configuration,
        IOpenIddictApplicationManager applicationManager,
        IOpenIddictScopeManager scopeManager,
        IPermissionDataSeeder permissionDataSeeder,
        IStringLocalizer<OpenIddictResponse> l)
    {
        _configuration = configuration;
        _applicationManager = applicationManager;
        _scopeManager = scopeManager;
        _permissionDataSeeder = permissionDataSeeder;
        L = l;
    }

    [UnitOfWork]
    public virtual async Task SeedAsync(DataSeedContext context)
    {
        await CreateScopesAsync();
        await CreateApplicationsAsync();
    }

    private async Task CreateScopesAsync()
    {
        if (await _scopeManager.FindByNameAsync("CourseMate") == null)
        {
            await _scopeManager.CreateAsync(new OpenIddictScopeDescriptor
            {
                Name = "CourseMate",
                DisplayName = "CourseMate API",
                Resources =
                {
                    "CourseMate"
                }
            });
        }
    }

    private async Task CreateApplicationsAsync()
    {
        List<string> commonScopes =
        [
            OpenIddictConstants.Permissions.Scopes.Address,
            OpenIddictConstants.Permissions.Scopes.Email,
            OpenIddictConstants.Permissions.Scopes.Phone,
            OpenIddictConstants.Permissions.Scopes.Profile,
            OpenIddictConstants.Permissions.Scopes.Roles,
            "CourseMate"
        ];

        IConfigurationSection configurationSection = _configuration.GetSection("OpenIddict:Applications");

        // Angular Admin Web
        string? adminWebClientId = configurationSection["CourseMate_AdminWeb:ClientId"];
        if (!adminWebClientId.IsNullOrWhiteSpace())
        {
            string adminWebRootUrl = configurationSection["CourseMate_AdminWeb:RootUrl"]!.TrimEnd('/');
            await CreateApplicationAsync(
                OpenIddictConstants.ApplicationTypes.Web,
                adminWebClientId,
                OpenIddictConstants.ClientTypes.Public,
                OpenIddictConstants.ConsentTypes.Implicit,
                "Admin Web",
                null,
                [
                    OpenIddictConstants.GrantTypes.AuthorizationCode,
                    OpenIddictConstants.GrantTypes.Password,
                    OpenIddictConstants.GrantTypes.ClientCredentials,
                    OpenIddictConstants.GrantTypes.RefreshToken,
                    "LinkLogin",
                    "Impersonation"
                ],
                commonScopes,
                [adminWebRootUrl],
                [adminWebRootUrl]
            );
        }

        // Angular client Web
        string? clientWebClientId = configurationSection["CourseMate_ClientWeb:ClientId"];
        if (!clientWebClientId.IsNullOrWhiteSpace())
        {
            string webClientRootUrl = configurationSection["CourseMate_ClientWeb:RootUrl"]!.TrimEnd('/');
            await CreateApplicationAsync(
                OpenIddictConstants.ApplicationTypes.Web,
                clientWebClientId,
                OpenIddictConstants.ClientTypes.Public,
                OpenIddictConstants.ConsentTypes.Implicit,
                "Client Web",
                null,
                [
                    OpenIddictConstants.GrantTypes.AuthorizationCode,
                    OpenIddictConstants.GrantTypes.Password,
                    OpenIddictConstants.GrantTypes.ClientCredentials,
                    OpenIddictConstants.GrantTypes.RefreshToken,
                    "LinkLogin",
                    "Impersonation"
                ],
                commonScopes,
                [webClientRootUrl],
                [webClientRootUrl]
            );
        }

        // Swagger Client
        string? swaggerClientId = configurationSection["CourseMate_Swagger:ClientId"];
        if (!swaggerClientId.IsNullOrWhiteSpace())
        {
            string swaggerRootUrl = configurationSection["CourseMate_Swagger:RootUrl"]?.TrimEnd('/')!;

            await CreateApplicationAsync(
                OpenIddictConstants.ApplicationTypes.Web,
                swaggerClientId,
                OpenIddictConstants.ClientTypes.Public,
                OpenIddictConstants.ConsentTypes.Implicit,
                "Swagger Application",
                null,
                [OpenIddictConstants.GrantTypes.AuthorizationCode],
                commonScopes,
                [$"{swaggerRootUrl}/swagger/oauth2-redirect.html"]
            );
        }
    }

    private async Task CreateApplicationAsync(
        string applicationType,
        string name,
        string type,
        string consentType,
        string displayName,
        string? secret,
        List<string> grantTypes,
        List<string> scopes,
        List<string>? redirectUris = null,
        List<string>? postLogoutRedirectUris = null,
        List<string>? permissions = null)
    {
        if (!string.IsNullOrEmpty(secret) && string.Equals(type, OpenIddictConstants.ClientTypes.Public, StringComparison.OrdinalIgnoreCase))
        {
            throw new BusinessException(L["NoClientSecretCanBeSetForPublicApplications"]);
        }

        if (string.IsNullOrEmpty(secret) && string.Equals(type, OpenIddictConstants.ClientTypes.Confidential, StringComparison.OrdinalIgnoreCase))
        {
            throw new BusinessException(L["TheClientSecretIsRequiredForConfidentialApplications"]);
        }

        if (!string.IsNullOrEmpty(name) && await _applicationManager.FindByClientIdAsync(name) != null)
        {
            return;
        }

        //throw new BusinessException(L["TheClientIdentifierIsAlreadyTakenByAnotherApplication"]);
        object? client = await _applicationManager.FindByClientIdAsync(name);
        if (client == null)
        {
            AbpApplicationDescriptor application = new()
            {
                ApplicationType = applicationType,
                ClientId = name,
                ClientType = type,
                ClientSecret = secret,
                ConsentType = consentType,
                DisplayName = displayName
            };

            Check.NotNullOrEmpty(grantTypes, nameof(grantTypes));
            Check.NotNullOrEmpty(scopes, nameof(scopes));

            if (new[] { OpenIddictConstants.GrantTypes.AuthorizationCode, OpenIddictConstants.GrantTypes.Implicit }.All(grantTypes.Contains))
            {
                application.Permissions.Add(OpenIddictConstants.Permissions.ResponseTypes.CodeIdToken);

                if (string.Equals(type, OpenIddictConstants.ClientTypes.Public, StringComparison.OrdinalIgnoreCase))
                {
                    application.Permissions.Add(OpenIddictConstants.Permissions.ResponseTypes.CodeIdTokenToken);
                    application.Permissions.Add(OpenIddictConstants.Permissions.ResponseTypes.CodeToken);
                }
            }

            if (!redirectUris.IsNullOrEmpty() || !postLogoutRedirectUris.IsNullOrEmpty())
            {
                application.Permissions.Add(OpenIddictConstants.Permissions.Endpoints.EndSession);
            }

            string[] buildInGrantTypes =
            [
                OpenIddictConstants.GrantTypes.Implicit,
                OpenIddictConstants.GrantTypes.Password,
                OpenIddictConstants.GrantTypes.AuthorizationCode,
                OpenIddictConstants.GrantTypes.ClientCredentials,
                OpenIddictConstants.GrantTypes.DeviceCode,
                OpenIddictConstants.GrantTypes.RefreshToken
            ];

            foreach (string grantType in grantTypes)
            {
                if (grantType == OpenIddictConstants.GrantTypes.AuthorizationCode)
                {
                    application.Permissions.Add(OpenIddictConstants.Permissions.GrantTypes.AuthorizationCode);
                    application.Permissions.Add(OpenIddictConstants.Permissions.ResponseTypes.Code);
                }

                if (grantType == OpenIddictConstants.GrantTypes.AuthorizationCode || grantType == OpenIddictConstants.GrantTypes.Implicit)
                {
                    application.Permissions.Add(OpenIddictConstants.Permissions.Endpoints.Authorization);
                }

                if (grantType == OpenIddictConstants.GrantTypes.AuthorizationCode ||
                    grantType == OpenIddictConstants.GrantTypes.ClientCredentials ||
                    grantType == OpenIddictConstants.GrantTypes.Password ||
                    grantType == OpenIddictConstants.GrantTypes.RefreshToken ||
                    grantType == OpenIddictConstants.GrantTypes.DeviceCode)
                {
                    application.Permissions.Add(OpenIddictConstants.Permissions.Endpoints.Token);
                    application.Permissions.Add(OpenIddictConstants.Permissions.Endpoints.Revocation);
                    application.Permissions.Add(OpenIddictConstants.Permissions.Endpoints.Introspection);
                }

                if (grantType == OpenIddictConstants.GrantTypes.ClientCredentials)
                {
                    application.Permissions.Add(OpenIddictConstants.Permissions.GrantTypes.ClientCredentials);
                }

                if (grantType == OpenIddictConstants.GrantTypes.Implicit)
                {
                    application.Permissions.Add(OpenIddictConstants.Permissions.GrantTypes.Implicit);
                }

                if (grantType == OpenIddictConstants.GrantTypes.Password)
                {
                    application.Permissions.Add(OpenIddictConstants.Permissions.GrantTypes.Password);
                }

                if (grantType == OpenIddictConstants.GrantTypes.RefreshToken)
                {
                    application.Permissions.Add(OpenIddictConstants.Permissions.GrantTypes.RefreshToken);
                }

                if (grantType == OpenIddictConstants.GrantTypes.DeviceCode)
                {
                    application.Permissions.Add(OpenIddictConstants.Permissions.GrantTypes.DeviceCode);
                    application.Permissions.Add(OpenIddictConstants.Permissions.Endpoints.DeviceAuthorization);
                }

                if (grantType == OpenIddictConstants.GrantTypes.Implicit)
                {
                    application.Permissions.Add(OpenIddictConstants.Permissions.ResponseTypes.IdToken);
                    if (string.Equals(type, OpenIddictConstants.ClientTypes.Public, StringComparison.OrdinalIgnoreCase))
                    {
                        application.Permissions.Add(OpenIddictConstants.Permissions.ResponseTypes.IdTokenToken);
                        application.Permissions.Add(OpenIddictConstants.Permissions.ResponseTypes.Token);
                    }
                }

                if (!buildInGrantTypes.Contains(grantType))
                {
                    application.Permissions.Add(OpenIddictConstants.Permissions.Prefixes.GrantType + grantType);
                }
            }

            string[] buildInScopes =
            [
                OpenIddictConstants.Permissions.Scopes.Address,
                OpenIddictConstants.Permissions.Scopes.Email,
                OpenIddictConstants.Permissions.Scopes.Phone,
                OpenIddictConstants.Permissions.Scopes.Profile,
                OpenIddictConstants.Permissions.Scopes.Roles
            ];

            foreach (string scope in scopes)
            {
                if (buildInScopes.Contains(scope))
                {
                    application.Permissions.Add(scope);
                }
                else
                {
                    application.Permissions.Add(OpenIddictConstants.Permissions.Prefixes.Scope + scope);
                }
            }

            if (!redirectUris.IsNullOrEmpty())
            {
                foreach (string redirectUri in redirectUris!.Where(redirectUri => !redirectUri.IsNullOrWhiteSpace()))
                {
                    if (!Uri.TryCreate(redirectUri, UriKind.Absolute, out Uri? uri) || !uri.IsWellFormedOriginalString())
                    {
                        throw new BusinessException(L["InvalidRedirectUri", redirectUri]);
                    }

                    if (application.RedirectUris.All(x => x != uri))
                    {
                        application.RedirectUris.Add(uri);
                    }
                }
            }

            if (!postLogoutRedirectUris.IsNullOrEmpty())
            {
                foreach (string postLogoutRedirectUri in postLogoutRedirectUris!.Where(postLogoutRedirectUri => !postLogoutRedirectUri.IsNullOrWhiteSpace()))
                {
                    if (!Uri.TryCreate(postLogoutRedirectUri, UriKind.Absolute, out Uri? uri) ||
                        !uri.IsWellFormedOriginalString())
                    {
                        throw new BusinessException(L["InvalidPostLogoutRedirectUri", postLogoutRedirectUri]);
                    }

                    if (application.PostLogoutRedirectUris.All(x => x != uri))
                    {
                        application.PostLogoutRedirectUris.Add(uri);
                    }
                }
            }

            if (permissions != null)
            {
                await _permissionDataSeeder.SeedAsync(
                    ClientPermissionValueProvider.ProviderName,
                    name,
                    permissions
                );
            }

            await _applicationManager.CreateAsync(application);
        }
    }
}