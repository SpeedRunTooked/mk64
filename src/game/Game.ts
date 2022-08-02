import _ from 'lodash';
import { User } from './User';
import { Category, DEFAULT_CATEGORY_JSON } from './Category';
import {
    GameConfigJSON,
    GameDataJSON,
    GameJSON,
    SubcategoryGroupJSON,
    UsersJSON,
} from 'FirebaseTypes';
import { DEFAULT_SUBCATEGORY_JSON, Subcategory } from './Subcategory';
import { GameStats } from './GameStats';
import { Entry } from './Entry';
import { Time } from './Time';
import { Score } from './Score';

export class Game {
    public entries: Entry[] = [];
    public users: User[] = [];
    public categories: Category[] = [];
    public subcategories: Subcategory[] = [];
    public stats: GameStats = new GameStats(this, [], []);
    public config: GameConfigJSON;
    public gameData: GameDataJSON;

    constructor(gameJson: GameJSON, usersJson: UsersJSON) {
        this.config = gameJson.config;
        this.gameData = gameJson.gameData;
        this.buildCategories(gameJson);
        this.buildSubcategories(gameJson);

        this.buildUsers(usersJson);
        this.buildEntries(gameJson);

        this.assignRecords();
        this.buildUserStats();
        this.stats = new GameStats(
            this,
            this.entries,
            this.gameData?.oldRecords || [],
        );
    }

    public getCategory(categorySlug: string): Category {
        return (
            this.categories.find(
                (category) => category.slug === categorySlug,
            ) || new Category(DEFAULT_CATEGORY_JSON)
        );
    }

    public getCategories(): Category[] {
        return _.orderBy(this.categories, ['displayOrder'], ['asc']);
    }

    public getSubcategory(subcategorySlug: string): Subcategory {
        return (
            this.subcategories.find(
                (subcategory) => subcategory.slug === subcategorySlug,
            ) || new Subcategory(DEFAULT_SUBCATEGORY_JSON)
        );
    }

    public getSubcategories(
        categorySlug?: string,
        sortByDisplayOrder?: boolean,
    ): Subcategory[] {
        let subcategories: Subcategory[] = [];

        if (categorySlug) {
            const category = this.getCategory(categorySlug);

            for (const subcategorySlug of category.subcategoryList) {
                subcategories.push(this.getSubcategory(subcategorySlug));
            }
        } else {
            subcategories = this.subcategories;
        }

        if (sortByDisplayOrder) {
            return subcategories.sort((a, b) => {
                const aOrder = this.getSubcategoryGroup(a.slug)?.displayOrder;
                const bOrder = this.getSubcategoryGroup(b.slug)?.displayOrder;
                if (aOrder && bOrder) {
                    return aOrder > bOrder ? 1 : -1;
                }
                return 0;
            });
        }

        return _.orderBy(subcategories, ['name'], ['asc']);
    }

    public getSubcategoryGroup(
        subcategoryGroupSlug: string,
    ): SubcategoryGroupJSON | undefined {
        return this.gameData.subcategoryGroups.find(
            (group) => group.slug === subcategoryGroupSlug,
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
        if (this.getCategory(categorySlug).entryType === 'score') {
            return _.orderBy(entries, ['score'], ['desc'])[0];
        }
        return _.orderBy(entries, ['score'], ['asc'])[0];
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

    private buildSubcategories(gameJson: GameJSON): void {
        for (const subcategoryJson of gameJson.subcategories) {
            this.subcategories.push(new Subcategory(subcategoryJson));
        }
    }

    private buildUsers(userJson: UsersJSON): void {
        for (const userId in userJson) {
            const user: User = new User(userId, userJson[userId], this);
            this.users.push(user);
        }
    }

    private buildEntries(gameJson: GameJSON): void {
        for (const entryId in gameJson.entries) {
            const entryJson = gameJson.entries[entryId];

            const category = this.getCategory(entryJson.categorySlug);

            if (category.entryType === 'timeMs') {
                this.entries.push(
                    new Time(entryId, entryJson, entryJson.userId, this),
                );
            }
            if (category.entryType === 'score') {
                this.entries.push(
                    new Score(entryId, entryJson, entryJson.userId, this),
                );
            }
        }
    }

    private assignRecords(): void {
        for (const category of this.categories) {
            const subcategories = this.getSubcategories(category.slug);
            for (const subcategory of subcategories) {
                let filteredEntries = this.entries.filter(
                    (entry) =>
                        entry.category.slug === category.slug &&
                        entry.subcategory.slug === subcategory.slug,
                );
                if (category.entryType === 'score') {
                    filteredEntries = _.orderBy(
                        filteredEntries,
                        ['score'],
                        ['desc'],
                    );
                } else {
                    filteredEntries = _.orderBy(
                        filteredEntries,
                        ['score'],
                        ['asc'],
                    );
                }
                if (filteredEntries.length > 0) {
                    filteredEntries[0].isCurrentRecord = true;
                    this.buildRecordImprovements(
                        filteredEntries,
                        category.entryType,
                    );
                }
            }
        }
    }

    private buildRecordImprovements(
        filteredEntryList: Entry[],
        entryType: string,
    ): void {
        const sortedEntryList = _.orderBy(
            filteredEntryList,
            ['created'],
            ['asc'],
        );

        let bestScore = 0;
        let bestTime = 999999999999999;

        for (const time of sortedEntryList) {
            if (entryType === 'score') {
                if (time.score > bestScore) {
                    time.isRecordImprovement = true;
                    bestScore = time.score;
                }
            } else {
                if (time.score < bestTime) {
                    time.isRecordImprovement = true;
                    bestTime = time.score;
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
}
