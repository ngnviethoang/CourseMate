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

        PermissionDefinition categoriesPermission = myGroup.AddPermission(CourseMatePermissions.Categories.Default, L("Permission:Categories"));
        categoriesPermission.AddChild(CourseMatePermissions.Categories.Create, L("Permission:Categories.Create"));
        categoriesPermission.AddChild(CourseMatePermissions.Categories.Edit, L("Permission:Categories.Edit"));
        categoriesPermission.AddChild(CourseMatePermissions.Categories.Delete, L("Permission:Categories.Delete"));

        PermissionDefinition chaptersPermission = myGroup.AddPermission(CourseMatePermissions.Chapters.Default, L("Permission:Chapters"));
        chaptersPermission.AddChild(CourseMatePermissions.Chapters.Create, L("Permission:Chapters.Create"));
        chaptersPermission.AddChild(CourseMatePermissions.Chapters.Edit, L("Permission:Chapters.Edit"));
        chaptersPermission.AddChild(CourseMatePermissions.Chapters.Delete, L("Permission:Chapters.Delete"));

        PermissionDefinition coursesPermission = myGroup.AddPermission(CourseMatePermissions.Courses.Default, L("Permission:Courses"));
        coursesPermission.AddChild(CourseMatePermissions.Courses.Create, L("Permission:Courses.Create"));
        coursesPermission.AddChild(CourseMatePermissions.Courses.Edit, L("Permission:Courses.Edit"));
        coursesPermission.AddChild(CourseMatePermissions.Courses.Delete, L("Permission:Courses.Delete"));

        PermissionDefinition enrollmentsPermission = myGroup.AddPermission(CourseMatePermissions.Enrollments.Default, L("Permission:Enrollments"));
        enrollmentsPermission.AddChild(CourseMatePermissions.Enrollments.Create, L("Permission:Enrollments.Create"));
        enrollmentsPermission.AddChild(CourseMatePermissions.Enrollments.Edit, L("Permission:Enrollments.Edit"));
        enrollmentsPermission.AddChild(CourseMatePermissions.Enrollments.Delete, L("Permission:Enrollments.Delete"));

        PermissionDefinition lessonsPermission = myGroup.AddPermission(CourseMatePermissions.Lessons.Default, L("Permission:Lessons"));
        lessonsPermission.AddChild(CourseMatePermissions.Lessons.Create, L("Permission:Lessons.Create"));
        lessonsPermission.AddChild(CourseMatePermissions.Lessons.Edit, L("Permission:Lessons.Edit"));
        lessonsPermission.AddChild(CourseMatePermissions.Lessons.Delete, L("Permission:Lessons.Delete"));

        PermissionDefinition ordersPermission = myGroup.AddPermission(CourseMatePermissions.Orders.Default, L("Permission:Orders"));
        ordersPermission.AddChild(CourseMatePermissions.Orders.Create, L("Permission:Orders.Create"));
        ordersPermission.AddChild(CourseMatePermissions.Orders.Edit, L("Permission:Orders.Edit"));
        ordersPermission.AddChild(CourseMatePermissions.Orders.Delete, L("Permission:Orders.Delete"));

        PermissionDefinition paymentRequestsPermission = myGroup.AddPermission(CourseMatePermissions.PaymentRequests.Default, L("Permission:PaymentRequests"));
        paymentRequestsPermission.AddChild(CourseMatePermissions.PaymentRequests.Create, L("Permission:PaymentRequests.Create"));
        paymentRequestsPermission.AddChild(CourseMatePermissions.PaymentRequests.Edit, L("Permission:PaymentRequests.Edit"));
        paymentRequestsPermission.AddChild(CourseMatePermissions.PaymentRequests.Delete, L("Permission:PaymentRequests.Delete"));

        PermissionDefinition reviewsPermission = myGroup.AddPermission(CourseMatePermissions.Reviews.Default, L("Permission:Reviews"));
        reviewsPermission.AddChild(CourseMatePermissions.Reviews.Create, L("Permission:Reviews.Create"));
        reviewsPermission.AddChild(CourseMatePermissions.Reviews.Edit, L("Permission:Reviews.Edit"));
        reviewsPermission.AddChild(CourseMatePermissions.Reviews.Delete, L("Permission:Reviews.Delete"));
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<CourseMateResource>(name);
    }
}