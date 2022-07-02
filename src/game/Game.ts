import _ from 'lodash';
import { Time } from './Time';
import { User } from './User';
import { Category, DEFAULT_CATEGORY_JSON } from './Category';
import { FirebaseDataJSON, GameElementJSON } from 'FirebaseTypes';
import { DEFAULT_SUBCATEGORY_JSON, Subcategory } from './Subcategory';

export interface GameElement {
    slug: string;
    name: string;
    json: GameElementJSON;
}

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
            this.categories.find(
                (category) => category.slug === categorySlug,
            ) || new Category(DEFAULT_CATEGORY_JSON)
        );
    }

    public getRecentEntries(): Time[] {
        return _.orderBy(this.times, ['created'], ['desc']);
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
        return new Subcategory(DEFAULT_SUBCATEGORY_JSON);
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
        const sortedTimes = _.orderBy(this.times, ['timeMs'], ['asc']);
        const recordArr: string[] = [];
        for (const time of sortedTimes) {
            if (recordArr.indexOf(time.runSlug) === -1) {
                time.isCurrentRecord = true;
                recordArr.push(time.runSlug);
            }
        }
    }

    private buildRecordImprovements(): void {
        const sortedTimes = _.orderBy(this.times, ['created'], ['asc']);

        // Build a record map that keeps track of each category-subcategory combination
        const recordMap: { [key: string]: number } = {};

        for (const time of sortedTimes) {
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
            user.appendTimes(this.times);
            user.generateStats();
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
