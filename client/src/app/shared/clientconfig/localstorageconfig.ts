import { GetCourseWithDetailsContent } from '../../models/response-models/course-content-with-detail';
import { LoginRegister } from '../../models/response-models/login-register-respone';

export class LocalStorageConfig {

    private static currentUserKey = 'currentUser';
    private static listCourseId = 'listCourse';

    public static RemoveUser(key: string) {
        localStorage.removeItem(this.currentUserKey);
    }

    public static SetUser(pJSONStringify: LoginRegister) {
        const valueUpdate = JSON.stringify(pJSONStringify);
        localStorage.setItem(this.currentUserKey, valueUpdate);
    }

    public static GetUser(): LoginRegister {
        const user = localStorage.getItem(this.currentUserKey);
        if (user === null) return null;
        return <LoginRegister>JSON.parse(user ?? '');
    }

    public static GetCurrentYearActive(): string {
        const currentYearActive = JSON.parse(localStorage.getItem(this.currentUserKey) ?? '').yearCurrent;
        return currentYearActive;
    }

    public static AddListCourses(listCourses: GetCourseWithDetailsContent[]) {
        this.RemoveUser(this.listCourseId);
        const valueUpdate = JSON.stringify(listCourses);
        localStorage.setItem(this.listCourseId, valueUpdate);
    }

    public static GetListCourseAddCart(): GetCourseWithDetailsContent[] {
        const listCourse = localStorage.getItem(this.listCourseId);
        if (listCourse === null) return null;
        return <GetCourseWithDetailsContent[]>JSON.parse(listCourse);
    }

    public static RemoveItemOnCart(id: number) {
        const listCourse = this.GetListCourseAddCart();
        if (listCourse === null) return;
        let items = listCourse.filter(item => item.id !== id);
        this.RemoveUser(this.listCourseId);
        this.AddListCourses(items);
    }

    public static RemoveAllDataListCourse() {
        this.RemoveUser(this.listCourseId);
    }

}
