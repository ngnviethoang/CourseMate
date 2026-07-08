using System.ComponentModel.DataAnnotations;
using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class StudentPreference : Entity
{
    public StudentPreference(Guid id, Guid studentId)
        : base(id)
    {
        StudentId = studentId;
    }

    public Guid StudentId { get; set; }

    public ICollection<string> FavouriteCategories { get; set; } = new List<string>();

    public int PreferredDifficulty { get; set; }

    [MaxLength(512)]
    public string LearningGoal { get; set; } = string.Empty;

    public int MinutesPerDay { get; set; }

    [MaxLength(64)]
    public string SkillLevel { get; set; } = string.Empty;

    public bool RecommendContests { get; set; }

    public bool RecommendExercises { get; set; }

    public bool AutoRefresh { get; set; } = true;
}