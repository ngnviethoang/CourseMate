namespace CourseMate.Contracts.Options;

public class RecommendationOptions
{
    public double ContentWeight { get; set; } = 0.45;
    public double BehaviorWeight { get; set; } = 0.35;
    public double CategoryWeight { get; set; } = 0.1;
    public double PopularityWeight { get; set; } = 0.1;
    public int TopNeighbors { get; set; } = 20;
    public int TopRecommendations { get; set; } = 30;
}