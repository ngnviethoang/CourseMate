using Hangfire;
using Hangfire.InMemory;

namespace CourseMate.Application.Tests.TestInfrastructure;

/// <summary>
///     Initializes Hangfire InMemory storage for unit tests.
/// </summary>
public static class HangfireTestSetup
{
    private static readonly object Lock = new();
    private static bool _initialized;

    public static void Initialize()
    {
        if (_initialized)
        {
            return;
        }

        lock (Lock)
        {
            if (_initialized)
            {
                return;
            }

            JobStorage.Current = new InMemoryStorage();
            _initialized = true;
        }
    }
}