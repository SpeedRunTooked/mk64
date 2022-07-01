import _ from 'lodash';
import { Time } from './Time';
import { User } from './User';
import { Category, defaultCategoryJson } from './Category';
import { FirebaseDataJSON } from 'FirebaseTypes';
import { defaultSubcategoryJson, Subcategory } from './Subcategory';

export class Game {
    public times: Time[] = [];
    public users: User[] = [];
    public categories: Category[] = [];
    public subcategorySet: Set<Subcategory>;

    constructor(firebaseDataJson: FirebaseDataJSON) {
        this.buildCategories(firebaseDataJson);
        this.subcategorySet = this.buildSubcategorySet();

        this.buildUsers(firebaseDataJson);
        this.buildTimes(firebaseDataJson);

        this.buildCurrentRecords();
        this.buildRecordImprovements();
        this.buildUserStats();
    }

    public getCategory(categorySlug: string): Category {
        return (
            this.categories.find((x) => x.slug === categorySlug) ||
            new Category(defaultCategoryJson)
        );
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

    public getSubcategory(subcategorySlug: string): Subcategory {
        for (const subcategory of this.subcategorySet.values()) {
            if (subcategory.slug === subcategorySlug) return subcategory;
        }
        return new Subcategory(defaultSubcategoryJson);
    }

    public getSubcategoryDisplayName(categorySlug: string): string {
        return (
            this.categories.find((category) => category.slug === categorySlug)
                ?.subcategoryName || 'Subcategory'
        );
    }

    private buildCategories(firebaseDataJson: FirebaseDataJSON): void {
        for (const categoryJson of firebaseDataJson.categories) {
            this.categories.push(new Category(categoryJson));
        }
    }

    private buildUsers(firebaseDataJson: FirebaseDataJSON): void {
        for (const userId in firebaseDataJson.users) {
            const user: User = new User(userId, firebaseDataJson.users[userId]);
            this.users.push(user);
        }
    }

    private buildTimes(firebaseDataJson: FirebaseDataJSON): void {
        for (const timeId in firebaseDataJson.times) {
            const timeJson = firebaseDataJson.times[timeId];
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

    private buildUserStats(): void {
        for (const user of this.users) {
            user.buildStats(this.times);
        }
    }

    private buildSubcategorySet(): Set<Subcategory> {
        const set: Set<Subcategory> = new Set();
        for (const category of this.categories) {
            for (const subcategory of category.subcategories) {
                set.add(subcategory);
            }
        }
        return set;
    }
}
