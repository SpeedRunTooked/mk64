import _ from 'lodash';
import { Player } from './Player';
import {
    CategoryJSON,
    FirebaseDataJSON,
    SubcategoryJSON,
    TimeJSON,
    UsersJSON,
} from 'ApiTypes';

import { Time } from './Time';
import { Category } from './Category';

export class Game {
    public api;
    public times: Time[] = [];
    public player: Player[] = [];
    public categories: Category[] = [];

    constructor(firebaseData: FirebaseDataJSON) {
        this.api = {
            users: firebaseData?.users || {},
            times: firebaseData?.times || {},
            categories: firebaseData.categories || [],
            subcategoryGroups: firebaseData.subcategoryGroups || [],
        };
        if (firebaseData) {
            this.buildCategories();
            this.buildTimes(firebaseData);
            this.buildCurrentRecords();
            this.buildRecordImprovements();
            this.buildPlayers();
        }
    }

    public getUserDisplayName(userId: string): string {
        return this.users[userId]?.displayName;
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

    public getPlayer(userId: string): Player | null {
        return this.player.filter((x) => x.playerId === userId)[0] || null;
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

    private buildPlayers(): void {
        for (const user in this.api.users) {
            const player = new Player(
                user,
                this.times.filter((x) => x.userId === user),
            );
            this.player.push(player);
        }
    }

    private buildCategories(): void {
        for (const categoryJson of this.api.categories) {
            this.categories.push(new Category(categoryJson));
        }
    }

    private buildTimes(firebaseData: FirebaseDataJSON): void {
        const result = [];
        const times = firebaseData.times;
        for (const timeId in times) {
            const data: TimeJSON = times[timeId];
            result.push(new Time(timeId, data, this));
        }
        this.times = result;
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

    get users(): UsersJSON {
        return this.api.users;
    }
}
