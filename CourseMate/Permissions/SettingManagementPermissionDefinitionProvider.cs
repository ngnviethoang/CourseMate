using CourseMate.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;

namespace CourseMate.Permissions;

public class SettingManagementPermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        PermissionGroupDefinition permissionGroupDefinition = context.GetGroup(SettingManagementPermissions.GroupName);
        permissionGroupDefinition.AddPermission(SettingManagementPermissions.Storages.Default, L("Permission:Storage"));
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<CourseMateResource>(name);
    }
}