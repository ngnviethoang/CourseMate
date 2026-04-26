namespace CourseMate.Contracts.DTOs;

public class ExerciseExampleDto
{
    public string Input { get; set; } = string.Empty;
    public string Output { get; set; } = string.Empty;
    public string? Explanation { get; set; }
}

public class ExerciseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Difficulty { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public Guid CreatedById { get; set; }
    public string? CreatedByName { get; set; }
    public int TestCaseCount { get; set; }
    public DateTimeOffset CreationTime { get; set; }
    public DateTimeOffset? LastModificationTime { get; set; }
}

public class ExerciseTestCaseDto
{
    public Guid Id { get; set; }
    public string Input { get; set; } = string.Empty;
    public string ExpectedOutput { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsHidden { get; set; }
    public int Order { get; set; }
}

public class ExerciseDefaultCodeDto
{
    public Guid Id { get; set; }
    public string Language { get; set; } = string.Empty;
    public string StarterCode { get; set; } = string.Empty;
}

public class ExerciseDetailDto : ExerciseDto
{
    public List<ExerciseExampleDto> Examples { get; set; } = [];
    public List<string> Constraints { get; set; } = [];
    public List<string> Hints { get; set; } = [];
    public List<ExerciseTestCaseDto> TestCases { get; set; } = [];
    public List<ExerciseDefaultCodeDto> DefaultCodes { get; set; } = [];
}
