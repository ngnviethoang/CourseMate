import { StudentUser } from './student-user';

export class CourseEvaluation {
    id?: number;
    idStudent: number;
    idCourse: number;
    voteStartNumber: number;
    commentEvaluation: string;
    like?: number;
    disLike?: number;
    users?: StudentUser;
}
