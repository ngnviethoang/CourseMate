namespace CourseMate.Contracts.DTOs;

public class RecommendationAnalyticsCourseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public int RecommendedViews { get; set; }
    public int Enrollments { get; set; }
    public double ConversionRate { get; set; }
}

public class RecommendationAnalyticsByCategoryDto
{
    public string CategoryName { get; set; } = string.Empty;
    public int RecommendedViews { get; set; }
    public int Enrollments { get; set; }
    public double ConversionRate { get; set; }
}

public class RecommendationEffectivenessDto
{
    public int TotalRecommendations { get; set; }
    public int ConvertedEnrollments { get; set; }
    public double OverallConversionRate { get; set; }

    public int ActiveStudents { get; set; }
    public int StudentsWithPersonalizedRecommendations { get; set; }
    public int ColdStartStudents { get; set; }
    public double ColdStartShare { get; set; }

    public int CoursesAvailable { get; set; }
    public int CoursesShown { get; set; }
    public double CatalogCoverage { get; set; }

    public List<RecommendationAnalyticsCourseDto> TopConvertingCourses { get; set; } = new();
    public List<RecommendationAnalyticsByCategoryDto> CategoryBreakdown { get; set; } = new();
    public List<RecommendationEffectivenessTrendPointDto> DailyTrend { get; set; } = new();
    public RecommendationEffectivenessMetricsDto Metrics { get; set; } = new();
}

public class RecommendationEffectivenessMetricsDto
{
    public int UniqueCoursesRecommended { get; set; }
    public int UniqueStudentsServed { get; set; }
    public double AverageEnrollmentsPerActiveStudent { get; set; }
    public double PersonalizedShare { get; set; }
    public string PersonalizationStrategy { get; set; } = string.Empty;
    public List<string> ActiveSignals { get; set; } = new();
}

public class RecommendationEffectivenessTrendPointDto
{
    public string Date { get; set; } = string.Empty;
    public int Recommendations { get; set; }
    public int Enrollments { get; set; }
    public double ConversionRate { get; set; }
}