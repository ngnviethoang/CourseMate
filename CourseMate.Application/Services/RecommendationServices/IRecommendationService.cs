using CourseMate.Contracts.DTOs;
using CourseMate.Persistent.Entities;

namespace CourseMate.Application.Services.RecommendationServices;

public interface IRecommendationService
{
    Task<RecommendationResponseDto> GetRecommendationsAsync(Guid studentId, int topN, CancellationToken ct);

    Task<int> RebuildSkillProfileAsync(Guid studentId, CancellationToken ct);

    Task<StudentPreferenceDto> UpsertPreferenceAsync(Guid studentId, UpsertStudentPreferenceRequest request, CancellationToken ct);

    Task<StudentPreferenceDto?> GetPreferenceAsync(Guid studentId, CancellationToken ct);

    Task<List<StudentSkillProfileDto>> GetSkillProfileAsync(Guid studentId, CancellationToken ct);

    Task<List<StudentSkillProfileDto>> GetWeakAreasAsync(Guid studentId, CancellationToken ct);
}

public interface IRecommendationSignalCollector
{
    Task<StudentSignals> CollectSignalsAsync(Guid studentId, CancellationToken ct);
}

public interface IRecommendationScorer
{
    Task<List<ScoredCourse>> ScoreCoursesAsync(StudentSignals signals, int topN, CancellationToken ct);

    Task<List<ScoredContest>> ScoreContestsAsync(StudentSignals signals, int topN, CancellationToken ct);

    Task<List<ScoredExercise>> ScoreExercisesAsync(StudentSignals signals, int topN, CancellationToken ct);
}

public interface IRecommendationLogger
{
    Task LogAsync(Guid studentId, string recommendationType, string strategy, int resultCount, double topScore, object payload, CancellationToken ct);
}

public interface IStudentPreferenceRepository
{
    Task<StudentPreference?> GetAsync(Guid studentId, CancellationToken ct);

    Task<StudentPreference> UpsertAsync(StudentPreference preference, CancellationToken ct);
}

public interface IStudentSkillProfileRepository
{
    Task<List<StudentSkillProfile>> GetAsync(Guid studentId, CancellationToken ct);

    Task UpsertAsync(StudentSkillProfile profile, CancellationToken ct);
}

public interface IRecommendationCourseCatalog
{
    Task<List<CourseCatalogRow>> GetCandidatesAsync(CancellationToken ct);
}

public sealed record CourseCatalogRow(
    Guid CourseId,
    string Title,
    string Description,
    string ImageUrl,
    decimal Price,
    Guid CategoryId,
    string CategoryName,
    Guid InstructorId,
    string InstructorName,
    double AverageRating,
    int EnrollmentCount);
