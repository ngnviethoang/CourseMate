using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;

namespace CourseMate.Tests.TestBase;

public class CourseMateTestDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    public Task SeedAsync(DataSeedContext context)
    {
        /* Seed additional test data... */

        return Task.CompletedTask;
    }
}