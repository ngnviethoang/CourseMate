import type {
  ExerciseDefaultCodeDto,
  ExerciseDetailDto,
  ExerciseExampleDto,
  ExerciseTestCaseDto,
  LessonType,
  QuizQuestionDto
} from '@/lib/types'
import type { Difficulty, ExerciseData } from '@/components/exercises/exercise-editor-modal'

export interface VideoContent {
  title: string
  segments: Array<{ time: string; script: string }>
  timestamps: Array<{ time: string; label: string }>
}

export interface ReadingContent {
  title: string
  markdown_content: string
}

export interface CodingContent {
  title: string
  problem_statement: string
  initial_code: string
  solution: string
  test_cases: Array<{ input: string; output: string; hidden: boolean }>
}

export interface QuizContent {
  title: string
  questions: Array<{
    q: string
    options: string[]
    ans: number
    explanation: string
  }>
}

export type AiContent = VideoContent | ReadingContent | CodingContent | QuizContent

const difficultyMap: Record<string, Difficulty> = {
  Easy: 'Dễ',
  Medium: 'Trung bình',
  Hard: 'Khó',
  Dễ: 'Dễ',
  'Trung bình': 'Trung bình',
  Khó: 'Khó'
}

function mapDifficulty(value: string): Difficulty {
  return difficultyMap[value] ?? 'Trung bình'
}

function mapExamples(examples: ExerciseExampleDto[]): ExerciseData['examples'] {
  return examples.map(example => ({
    input: example.input,
    output: example.output,
    explanation: example.explanation
  }))
}

function mapDefaultCode(defaultCodes: ExerciseDefaultCodeDto[]): ExerciseData['defaultCode'] {
  return defaultCodes.reduce<Record<string, string>>((accumulator, current) => {
    accumulator[current.language] = current.starterCode
    return accumulator
  }, {})
}

function mapTestCases(testCases: ExerciseTestCaseDto[]): ExerciseData['testCases'] {
  return testCases.map(testCase => ({
    input: testCase.input,
    expectedOutput: testCase.expectedOutput,
    description: testCase.description,
    isHidden: testCase.isHidden
  }))
}

export function mapExerciseDetailToExerciseData(dto: ExerciseDetailDto): ExerciseData {
  return {
    id: dto.id,
    title: dto.title,
    difficulty: mapDifficulty(dto.difficulty),
    category: dto.category,
    description: dto.description,
    examples: mapExamples(dto.examples),
    constraints: dto.constraints,
    hints: dto.hints,
    defaultCode: mapDefaultCode(dto.defaultCodes),
    testCases: mapTestCases(dto.testCases)
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isVideoContent(value: unknown): value is VideoContent {
  return (
    isRecord(value) &&
    typeof value.title === 'string' &&
    Array.isArray(value.segments) &&
    Array.isArray(value.timestamps)
  )
}

function isReadingContent(value: unknown): value is ReadingContent {
  return isRecord(value) && typeof value.title === 'string' && typeof value.markdown_content === 'string'
}

function isCodingContent(value: unknown): value is CodingContent {
  return (
    isRecord(value) &&
    typeof value.title === 'string' &&
    typeof value.problem_statement === 'string' &&
    typeof value.initial_code === 'string' &&
    typeof value.solution === 'string' &&
    Array.isArray(value.test_cases)
  )
}

function isQuizContent(value: unknown): value is QuizContent {
  return isRecord(value) && typeof value.title === 'string' && Array.isArray(value.questions)
}

export function parseAiContent(raw: string, lessonType: LessonType): AiContent | null {
  try {
    const parsed: unknown = JSON.parse(raw)

    switch (lessonType) {
      case 'Video':
        return isVideoContent(parsed) ? parsed : null
      case 'Reading':
        return isReadingContent(parsed) ? parsed : null
      case 'Coding':
        return isCodingContent(parsed) ? parsed : null
      case 'Quiz':
        return isQuizContent(parsed) ? parsed : null
      default:
        return null
    }
  } catch {
    return null
  }
}

export type QuizQuestionAnswer = NonNullable<QuizQuestionDto['answers']>[number]
