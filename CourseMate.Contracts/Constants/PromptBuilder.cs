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
                - Add simple examples. Do not invent facts. 
                - If something is uncertain, say "I don't know".

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
        return $$$"""
                  You are an experienced teacher preparing lecture slides. Use the input as source material and create a slide outline for teaching.
                        
                  Output format: Return ONLY valid JSON. Do not wrap in markdown.Do not include explanation. Ensure the JSON is complete and parseable.
                        JSON schema:
                           {{
                             "lessonTitle": "string",
                             "relatedLinks": ["string"],
                             "slides": [
                               {{
                                 "slideNumber": 1,
                                 "title": "string",
                                 "bullets": ["string"],
                                 "relatedLinks": ["string"]
                               }}
                             ]
                           }}
                                   
                  Requirements:
                      - lessonTitle: title of the lesson
                      - relatedLinks: general references related to the whole lesson
                      - slides: generate a reasonable number of slides (minimum 6, maximum 12) based on the input content
                      - each slide must include: slideNumber, title, bullets, relatedLinks
                      - bullets only
                      - 2 to 4 bullets per slide
                      - each bullet should be short and slide-friendly
                      - no long paragraphs
                      - avoid repetition
                      - if a point is uncertain, write "[Need verification]"
                      - include relevant links when possible
                      - if no related link is available, return []
                      - keep the entire response concise to fit within token limits

                  Suggested slide flow:
                      - Title and Learning Objective
                      - Overview
                      - Key Concepts (expand into multiple slides if needed)
                      - Detailed Explanation
                      - Examples
                      - Common Misunderstandings
                      - Summary

                  Input:
                  {{{researchInput}}}
                  """;
    }
}