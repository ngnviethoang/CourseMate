using CourseMate.Localization;
using Microsoft.Extensions.Localization;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Ui.Branding;

namespace CourseMate;

[Dependency(ReplaceServices = true)]
public class CourseMateBrandingProvider : DefaultBrandingProvider
{
    private readonly IStringLocalizer<CourseMateResource> _localizer;

    public CourseMateBrandingProvider(IStringLocalizer<CourseMateResource> localizer)
    {
        _localizer = localizer;
    }

    public override string AppName => _localizer["AppName"];
}