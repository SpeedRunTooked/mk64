import _ from 'lodash';
import { User } from './User';
import { CategoryJSON, FirebaseDataJSON, SubcategoryJSON } from 'ApiTypes';

import { Time } from './Time';
import { Category } from './Category';
import { FirebaseData } from './FirebaseData';

export class Game {
    public firebaseData;
    public times: Time[] = [];
    public users: User[] = [];
    public categories: Category[] = [];

    constructor(firebaseDataJson: FirebaseDataJSON) {
        this.firebaseData = new FirebaseData(firebaseDataJson);
        this.buildCategories();
        this.buildUsers();
        this.buildTimes(firebaseDataJson);
        this.buildCurrentRecords();
        this.buildRecordImprovements();
    }

    public getCategoryJson(categorySlug: string): CategoryJSON {
        return this.categories.filter((x) => x.slug === categorySlug)[0].json;
    }

    public getSubcategoryJson(
        categorySlug: string,
        subcategorySlug: string,
    ): SubcategoryJSON {
        return this.getCategoryJson(categorySlug)?.subcategories.filter(
            (subcategory) => subcategory.slug === subcategorySlug,
        )[0];
    }

    public getRecentEntries(num: number): Time[] {
        const sorted = _.orderBy(this.times, ['created'], ['desc']);
        return sorted.slice(0, num);
    }

    public getUser(userId: string): User {
        return this.users.filter((user) => user.id === userId)[0];
    }

    public getRecord(subcategorySlug: string, categorySlug: string): Time {
        const times = _.filter(
            this.times,
            (time) =>
                time.subcategory.slug === subcategorySlug &&
                time.category.slug === categorySlug,
        );
        return _.orderBy(times, ['timeMs'], ['asc'])[0];
    }

    private buildUsers(): void {
        for (const userId in this.firebaseData.users) {
            const user: User = new User(
                userId,
                this.firebaseData.users[userId],
            );
            this.users.push(user);
        }
    }

    private buildCategories(): void {
        for (const categoryJson of this.firebaseData.categories) {
            this.categories.push(new Category(categoryJson));
        }
    }

    private buildTimes(firebaseData: FirebaseDataJSON): void {
        const times = firebaseData.times;
        for (const timeId in times) {
            const timeJson = times[timeId];
            const user = this.getUser(timeJson.userId);
            this.times.push(new Time(timeId, timeJson, user, this));
        }
    }

    private buildCurrentRecords(): void {
        const sorted = _.orderBy(this.times, ['timeMs'], ['asc']);
        const recordArr: string[] = [];
        for (const time of sorted) {
            if (recordArr.indexOf(time.runSlug) === -1) {
                time.isCurrentRecord = true;
                recordArr.push(time.runSlug);
            }
        }
    }

    private buildRecordImprovements(): void {
        const sorted = _.orderBy(this.times, ['created'], ['asc']);
        const recordMap: { [key: string]: number } = {};
        for (const time of sorted) {
            if (!recordMap[time.runSlug]) {
                time.isRecordImprovement = true;
                recordMap[time.runSlug] = time.timeMs;
            } else {
                if (recordMap[time.runSlug] > time.timeMs) {
                    time.isRecordImprovement = true;
                    recordMap[time.runSlug] = time.timeMs;
                }
            }
        }
    }
}
