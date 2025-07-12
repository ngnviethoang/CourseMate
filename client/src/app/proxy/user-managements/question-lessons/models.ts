
export interface CreateQuestionLessonDto extends QuestionLessonDto {
}

export interface QuestionLessonDto {
  lessonId?: string;
  timeLearned?: string;
  content?: string;
}

export interface UpdateQuestionLessonDto extends QuestionLessonDto {
}
