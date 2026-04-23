namespace CourseMate.Contracts.Constants;

public static class PromptBuilder
{
    public static string BuildResearchPrompt(string userInput)
    {
        return $"""
                You are a research assistant helping create teaching materials.

                Goal:
                - Analyze the topic in the input.
                - Expand it with essential, high-confidence knowledge.
                - Clarify key terms, mechanisms, and related ideas.
                - Add simple examples.
                - Do not invent facts. If something is uncertain, say "I don't know".

                Output format:
                1. Topic Summary
                - brief description of the topic

                2. Key Concepts
                - concept: short explanation

                3. Important Details
                - core mechanisms, steps, causes, effects, or comparisons

                4. Examples
                - simple, easy-to-understand examples

                5. Common Misunderstandings
                - frequent mistakes or confusing points

                6. Unknowns
                - missing, uncertain, or unverified points

                Rules:
                - bullet points only
                - concise and clear
                - teaching-friendly wording
                - avoid repetition
                - no tables
                - no fabricated citations

                Input:
                {userInput}
                """;
    }

    public static string BuildLectureOutlinePrompt(string researchInput)
    {
        return $"""
                You are an experienced teacher preparing lecture slides.

                Use the input as source material and create a slide outline for teaching.

                Output format:
                Slide 1: Title and Learning Objective
                - lecture title
                - what students should learn

                Slide 2: Overview
                - brief introduction
                - why the topic matters

                Slide 3: Key Concept 1
                - concise teaching points

                Slide 4: Key Concept 2
                - concise teaching points

                Slide 5: Detailed Explanation
                - process, logic, or important breakdown

                Slide 6: Examples
                - simple examples or use cases

                Slide 7: Common Misunderstandings
                - confusing points to avoid

                Slide 8: Summary
                - key takeaways

                Rules:
                - bullet points only
                - 2 to 4 bullets per slide
                - each bullet should be short and slide-friendly
                - no long paragraphs
                - avoid repetition
                - if a point is uncertain, write "[Need verification]"
                - keep the outline concise but complete

                Input:
                {researchInput}
                """;
    }
}