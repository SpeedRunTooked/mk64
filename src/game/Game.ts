import _ from 'lodash';
import { PlayerStats } from '../PlayerStats';
import {
    CategoryJSON,
    DataJSON,
    SubcategoryJSON,
    TimeJSON,
    UsersJSON,
} from 'ApiTypes';

import { Time } from './Time';

export class Game {
    public api;
    public times: Time[] = [];
    public playerStats: PlayerStats[] = [];

    constructor(data: DataJSON) {
        this.api = {
            gamedata: data?.gamedata || {},
            users: data?.users || {},
            times: data?.times || {},
            categories: data.categories || [],
        };
        if (data) {
            this.buildTimes(data);
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

    public getCategory(categorySlug: string): CategoryJSON {
        return this.categories.filter((x) => x.slug === categorySlug)[0];
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
            (x) =>
                x.subcategorySlug === subcategorySlug &&
                x.categorySlug === categorySlug,
        );
        return _.orderBy(times, ['timeMs'], ['asc'])[0];
    }

    public getSubcategories(categorySlug: string): SubcategoryJSON[] {
        return _.sortBy(this.getCategory(categorySlug).subcategories, [
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

    private buildTimes(data: DataJSON): void {
        const result = [];
        const times = data.times;
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
            const key = time.categorySlug + time.subcategorySlug;
            if (recordArr.indexOf(key) === -1) {
                time.isCurrentRecord = true;
                recordArr.push(key);
            }
        }
    }

    private buildRecordImprovements(): void {
        const sorted = _.orderBy(this.times, ['created'], ['asc']);
        const recordMap: { [key: string]: number } = {};
        for (const time of sorted) {
            const key = time.categorySlug + time.subcategorySlug;
            if (!recordMap[key]) {
                time.isRecordImprovement = true;
                recordMap[key] = time.timeMs;
            } else {
                if (recordMap[key] > time.timeMs) {
                    time.isRecordImprovement = true;
                    recordMap[key] = time.timeMs;
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