using Volo.Abp.Application.Services;
using CourseMate.Localization;

namespace CourseMate.Services;

/* Inherit your application services from this class. */
public abstract class CourseMateAppService : ApplicationService
{
    protected CourseMateAppService()
    {
        LocalizationResource = typeof(CourseMateResource);
    }
}