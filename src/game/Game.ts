import _ from 'lodash';
import { User } from './User';
import { Category, DEFAULT_CATEGORY_JSON } from './Category';
import {
    GameConfigJSON,
    GameElementJSON,
    GameJSON,
    UsersJSON,
} from 'FirebaseTypes';
import { DEFAULT_SUBCATEGORY_JSON, Subcategory } from './Subcategory';
import { GameStats } from './GameStats';
import { Entry } from './Entry';
import { Time } from './Time';

export interface GameElement {
    slug: string;
    name: string;
    json: GameElementJSON;
}

export class Game {
    public entries: Entry[] = [];
    public users: User[] = [];
    public categories: Category[] = [];
    public subcategorySet: Set<Subcategory>;
    public stats: GameStats = new GameStats(this, [], []);
    public config: GameConfigJSON;

    constructor(gameJson: GameJSON, usersJson: UsersJSON) {
        this.config = gameJson.config;
        this.buildCategories(gameJson);
        this.subcategorySet = this.buildSubcategorySet();

        this.buildUsers(usersJson);
        this.buildEntries(gameJson);

        this.buildCurrentRecords();
        this.buildRecordImprovements();
        this.buildUserStats();
        this.stats = new GameStats(
            this,
            this.entries,
            gameJson.gamedata?.oldRecords || [],
        );
    }

    public getCategory(categorySlug: string): Category {
        return (
            this.categories.find(
                (category) => category.slug === categorySlug,
            ) || new Category(DEFAULT_CATEGORY_JSON)
        );
    }

    public getRecentEntries(): Entry[] {
        return _.orderBy(this.entries, ['created'], ['desc']);
    }

    public getUser(userId: string): User {
        return this.users.filter((user) => user.id === userId)[0];
    }

    public getEntries(categorySlug: string, subcategorySlug: string): Entry[] {
        return _.filter(
            this.entries,
            (time) =>
                time.subcategory.slug === subcategorySlug &&
                time.category.slug === categorySlug,
        );
    }

    public getRecord(categorySlug: string, subcategorySlug: string): Entry {
        const entries = this.getEntries(categorySlug, subcategorySlug);
        return _.orderBy(entries, ['score'], ['asc'])[0];
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

    private buildCategories(gameJson: GameJSON): void {
        for (const categoryJson of gameJson.categories) {
            this.categories.push(new Category(categoryJson));
        }
    }

    private buildUsers(userJson: UsersJSON): void {
        for (const userId in userJson.users) {
            const user: User = new User(userId, userJson[userId]);
            this.users.push(user);
        }
    }

    private buildEntries(gameJson: GameJSON): void {
        for (const entryId in gameJson.entries) {
            const entryJson = gameJson.entries[entryId];

            if (this.config.entryType === 'timeMs') {
                this.entries.push(
                    new Time(entryId, entryJson, entryJson.userId, this),
                );
            }
        }
    }

    private buildCurrentRecords(): void {
        const sortedEntries = _.orderBy(this.entries, ['score'], ['asc']);
        const recordArr: string[] = [];
        for (const entry of sortedEntries) {
            if (recordArr.indexOf(entry.runSlug) === -1) {
                entry.isCurrentRecord = true;
                recordArr.push(entry.runSlug);
            }
        }
    }

    private buildRecordImprovements(): void {
        const sortedEntries = _.orderBy(this.entries, ['created'], ['asc']);

        // Build a record map that keeps track of each category-subcategory combination
        const recordMap: { [key: string]: number } = {};

        for (const time of sortedEntries) {
            if (!recordMap[time.runSlug]) {
                time.isRecordImprovement = true;
                recordMap[time.runSlug] = time.score;
            } else {
                if (recordMap[time.runSlug] > time.score) {
                    time.isRecordImprovement = true;
                    recordMap[time.runSlug] = time.score;
                }
            }
        }
    }

    private buildUserStats(): void {
        for (const user of this.users) {
            user.appendEntries(this.entries);
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
