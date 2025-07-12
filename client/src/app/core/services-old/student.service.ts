import { Injectable } from '@angular/core';
import { TransferHttp } from '../transfer-http/transfer-http';
import { StudentUser } from '../../models/student-user';
import { LinkSettings } from '../../shared/linksetting/LinkSetting';
import { map } from 'rxjs/operators';
import { RepositoryModel } from '../../models/repository_base';
import { BookMarkCourse } from '../../models/book-mark';
import { Course } from '../../models/course';
import { LocalStorageConfig } from '../../shared/clientconfig/localstorageconfig';

@Injectable({ providedIn: 'root' })
export class StudentServices {
    constructor(
        private transferHttp: TransferHttp
    ) {
    }

    createStudent(model: StudentUser) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Student', 'CreateStudent');
        return this.transferHttp.post(ApiUrl, model).pipe(map((res: RepositoryModel<boolean>) => res));
    }

    updateStatusStudent(model: StudentUser) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Student', 'UpdateStatusStudent', model.id);
        return this.transferHttp.put(ApiUrl, model).pipe(map((res: RepositoryModel<boolean>) => res));
    }

    updateStudent(model: StudentUser) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Student', 'UpdateStudent', model.id);
        return this.transferHttp.put(ApiUrl, model).pipe(map((res: RepositoryModel<boolean>) => res));
    }

    getStudents() {
        const ApiUrl = LinkSettings.GetResLinkSetting('Student', 'GetListStudents');
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<StudentUser[]>) => res));
    }

    getStudent(id: number) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Student', 'GetStudent', id);
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<StudentUser>) => res));
    }

    getUserOfProject() {
        const ApiUrl = LinkSettings.GetResLinkSetting('Student', 'GetListUserManager');
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<StudentUser[]>) => res));
    }

    createBookmarkCourse(model: BookMarkCourse) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Student', 'CreateBookmarkCourse');
        return this.transferHttp.post(ApiUrl, model).pipe(map((res: RepositoryModel<boolean>) => res));
    }

    updateStatusBookmarkCourse(model: BookMarkCourse) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Student', 'UpdateStatusBookmarkCourse', model.id);
        return this.transferHttp.put(ApiUrl, model).pipe(map((res: RepositoryModel<boolean>) => res));
    }

    getListBookmarkCourse() {
        let getValueOfUser = LocalStorageConfig.GetUser();
        const ApiUrl = LinkSettings.GetResLinkSetting('Student', 'GetListBookmarkCourse', getValueOfUser.userId);
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<Course[]>) => res));
    }

    removeBookmarkCourse(id: number) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Student', 'RemoveBookmarkCourse', id);
        return this.transferHttp.delete(ApiUrl).pipe(map((res: RepositoryModel<boolean>) => res));
    }

    getDataCourseOfStudent() {
        let getValueOfUser = LocalStorageConfig.GetUser();
        const ApiUrl = LinkSettings.GetResLinkSetting('Student', 'GetCoursesOfStudent', getValueOfUser.userId);
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<Course[]>) => res));

    }

    getListUserNameRegisterForCourse(idCourse: number) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Student', 'GetListUserNameRegisterForCourse', idCourse);
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<string[]>) => res));

    }
}
