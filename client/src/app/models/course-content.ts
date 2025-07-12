export class CourseContent {
    id: number;
    name: string;
    idCourse: number;
}

export class CourseContentDetails {
    id: number;
    idContent: number;
    nameSubContent: string;
    timeOfContent: string;
    isLearningFree: boolean;
    idVideoUpload: string;
    fileNameVideo: string;
    isFinishConvert: boolean;
    fileUploadUrlStream?: string;

}
