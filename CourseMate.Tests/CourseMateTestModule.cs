using CourseMate.Tests.TestBase;
using Volo.Abp.Modularity;

namespace CourseMate.Tests;

[DependsOn(
    typeof(CourseMateModule),
    typeof(CourseMateTestBaseModule)
)]
public class CourseMateTestModule : AbpModule;