import { Course } from '../course';
import { Partner } from '../partner';

export class HomeDataModel {
    partners?: Partner[];
    listContentData: ListContentData[];
}


export class ListContentData {
    nameContent?: string;
    listDataOfContent?: Course[];
}
