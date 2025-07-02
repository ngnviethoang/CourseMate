using CourseMate.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;

namespace CourseMate.Permissions;

public class CourseMatePermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        PermissionGroupDefinition myGroup = context.AddGroup(CourseMatePermissions.GroupName);


        PermissionDefinition booksPermission = myGroup.AddPermission(CourseMatePermissions.Books.Default, L("Permission:Books"));
        booksPermission.AddChild(CourseMatePermissions.Books.Create, L("Permission:Books.Create"));
        booksPermission.AddChild(CourseMatePermissions.Books.Edit, L("Permission:Books.Edit"));
        booksPermission.AddChild(CourseMatePermissions.Books.Delete, L("Permission:Books.Delete"));

        //Define your own permissions here. Example:
        //myGroup.AddPermission(CourseMatePermissions.MyPermission1, L("Permission:MyPermission1"));
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<CourseMateResource>(name);
    }
}