import _ from 'lodash';
import { PlayerStats } from '../PlayerStats';
import {
    CategoryJSON,
    FirebaseDataJSON,
    SubcategoryJSON,
    TimeJSON,
    UsersJSON,
} from 'ApiTypes';

import { Time } from './Time';

export class Game {
    public api;
    public times: Time[] = [];
    public playerStats: PlayerStats[] = [];

    constructor(firebaseData: FirebaseDataJSON) {
        this.api = {
            users: firebaseData?.users || {},
            times: firebaseData?.times || {},
            categories: firebaseData.categories || [],
            subcategoryGroups: firebaseData.subcategoryGroups || [],
        };
        if (firebaseData) {
            this.buildTimes(firebaseData);
            this.buildCurrentRecords();
            this.buildRecordImprovements();
            this.buildPlayerStats();
        }
    }

    public getUserDisplayName(userId: string): string {
        return this.users[userId]?.displayName;
    }

    public getSubcategoryName(
        categorySlug: string,
        subcategorySlug: string,
    ): string {
        const subcategories = this.categories.find(
            (x) => x.slug === categorySlug,
        )?.subcategories;
        return (
            subcategories?.find((x) => x.slug === subcategorySlug)?.name || ''
        );
    }

    public getSubcategoryTypeName(categorySlug: string): string {
        return (
            this.categories.find((x) => x.slug === categorySlug)
                ?.subcategoryName || ''
        );
    }

    public getCategoryJson(categorySlug: string): CategoryJSON {
        return this.categories.filter((x) => x.slug === categorySlug)[0];
    }

    public getSubcategoryJson(
        categorySlug: string,
        subcategorySlug: string,
    ): SubcategoryJSON {
        return this.getCategoryJson(categorySlug).subcategories.filter(
            (subcategory) => subcategory.slug === subcategorySlug,
        )[0];
    }

    public getCategoryName(recordSlug: string): string {
        for (const type of this.categories) {
            if (type.slug === recordSlug) return type.name;
        }
        return '';
    }

    public getRecentEntries(num: number): Time[] {
        const sorted = _.orderBy(this.times, ['created'], ['desc']);
        return sorted.slice(0, num);
    }

    public getPlayerStats(userId: string): PlayerStats | null {
        return this.playerStats.filter((x) => x.playerId === userId)[0] || null;
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

    public getSubcategories(categorySlug: string): SubcategoryJSON[] {
        return _.sortBy(this.getCategoryJson(categorySlug).subcategories, [
            'displayOrder',
        ]);
    }

    public subcategoryExistsInCategory(
        subcategorySlug: string,
        categorySlug: string,
    ): boolean {
        const subcategoryList = this.getSubcategories(categorySlug);
        return (
            subcategoryList?.filter((x) => x.slug === subcategorySlug).length >
            0
        );
    }

    private buildPlayerStats(): void {
        for (const user in this.api.users) {
            const player = new PlayerStats(
                user,
                this.times.filter((x) => x.userId === user),
            );
            this.playerStats.push(player);
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
    get categories(): CategoryJSON[] {
        return _.sortBy(this.api.categories, ['displayOrder']);
    }
}
