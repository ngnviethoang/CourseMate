export interface CategoryDto {
    id: string;
    name: string;
    code: string;
    note?: string;
}

export interface CourseDto {
    id: string;
    name: string;
    code: string;
    note?: string;
    description?: string;
    newPrice: number;
    oldPrice: number;
    discount: number;
    authorId: string;
    author?: AuthorDto;
    thumbnail?: string;
    timeCreated: string;
    chapters?: ChapterDto[];
    categoryId: string;
    category?: CategoryDto;
    totalStudents: number;
    totalLessons: number;
    highlights?: string[];
    relativeCourses?: CourseDto[];
    top5Reviews?: ReviewDto[];
}

export interface ChapterDto {
    id: string;
    courseId: string;
    name: string;
    code: string;
    note?: string;
    thumbnail?: string;
    timeCreated: Date;
    position: number;
    lessons?: LessonDto[];
}

export class LessonDto {
    id: string;
    chapterId: string;
    name: string;
    code: string;
    note?: string;
    description?: string;
    duration: string;
    videoUrl: string;
    thumbnail?: string;
    timeCreated: Date;
    position: number;
}

export interface BasketDto {
    items: BasketItemDto[];
    totalBill: number;
    discount: number;
    totalAmount: number;
    totalItems: number;
}

export interface BasketItemDto {
    courseId: string;
    timeCreated: Date;
    name: string;
    thumbnail: string;
    price: number;
    description: string;
    categoryName: string;
    authorName: string;
    totalChapter: number;
    duration: number;
    totalVote: number;
    discount: number;
    sortNumber: number;
}

export interface AuthorDto {
    userName: string;
    avatar: string;
    bio: string;
}

export interface ReviewDto {
    title: string;
    content: string;
    rating: number;
    userId: string;
    user?: AppUserDto;
    courseId: string;
    timeCreated: string;
}

export interface AppUserDto {
    userName: string;
    avatar: string;
    fullName: string;
}

export interface LoginResponseDto {
    result: number;
    description: string;
}
