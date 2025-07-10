import { PagedAndSortedResultRequestDto, PagedResultRequestDto } from '@abp/ng.core';

export class GetListCourseRequestDto extends PagedAndSortedResultRequestDto {
    categoryId?: string;
}

export class GetListChapterRequestDto extends PagedAndSortedResultRequestDto {
    courseId?: string;
}

export class GetListLessonRequestDto extends PagedAndSortedResultRequestDto {
    chapterId?: string;
}

export class GetListBaskItemRequestDto extends PagedResultRequestDto {
}

export class LoginRequestDto {
    userNameOrEmailAddress: string;
    password: string;
    rememberMe: boolean;
}

