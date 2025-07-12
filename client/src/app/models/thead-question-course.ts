import { StudentUser } from './student-user';

export class TheadQuestionCourse {
    id: number;
    idCourse: number;
    idStudent: number;
    comment: string;
    like: number;
    disLike: number;
    totalComment: number;
    user: StudentUser;
    totalCommentForThead: number;
}
