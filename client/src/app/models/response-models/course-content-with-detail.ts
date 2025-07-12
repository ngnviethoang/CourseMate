import { Course } from '../course';
import { CourseContent, CourseContentDetails } from '../course-content';
import { StudentUser } from '../student-user';

export class CourseContentWithDetails extends CourseContent {
    contentAndContentDetails: CourseContentDetails[];
}

export class GetCourseWithDetailsContent extends Course {
    totalOrder: number;
    listContentCourseDetails: CourseContentWithDetails[];
    listCourseRate: Course[];
    author: StudentUser;
    isPurchase?: boolean;
}


export class ContentAndDetails extends CourseContent {
    listContentCourseDetails: CourseContentDetails[];
}
