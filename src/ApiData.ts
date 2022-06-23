import { Category, FirebaseData, Time, Users } from 'ApiTypes';
import { TimeUtils } from './utils/TimeUtils';
import _ from 'lodash';
import { PlayerStats } from './PlayerStats';

export interface TimeEntry {
    userId: string;
    userDisplayName: string;
    created: Date;
    link: string;
    subcategorySlug: string;
    timeMs: number;
    timeElapsed: string;
    note: string;
    categorySlug: string;
    timeId: string;
    isCurrentRecord: boolean;
    isRecordImprovement: boolean;
}

export class ApiData {
    public api;
    public times: TimeEntry[] = [];
    public playerStats: PlayerStats[] = [];

    constructor(data: FirebaseData) {
        this.api = {
            gamedata: data?.gamedata || {},
            users: data?.users || {},
            times: data?.times || {},
            categories: data?.categories || {},
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
            (category) => category.slug === categorySlug,
        )?.subcategories;
        return (
            subcategories?.find(
                (subcategory) => subcategory.slug === subcategorySlug,
            )?.name || ''
        );
    }

    public getcategorySlug(recordSlug: string): string {
        for (const type of this.categories) {
            if (type.slug === recordSlug) return type.name;
        }
        return '';
    }

    public getRecentTimes(num: number): TimeEntry[] {
        const sorted = _.orderBy(this.times, ['created'], ['desc']);
        return sorted.slice(0, num);
    }

    public getPlayerStats(userId: string): PlayerStats | null {
        return this.playerStats.filter((x) => x.playerId === userId)[0] || null;
    }

    public isRecord(time: TimeEntry): boolean {
        const times = this.times.filter((x) => {
            return (
                x.subcategorySlug === time.subcategorySlug &&
                x.categorySlug === time.categorySlug
            );
        });

        if (times.length === 0) return true;

        const record = _.minBy(times, 'timeMs') as TimeEntry;
        return time.timeId === record.timeId;
    }

    public getRecord(subcategorySlug: string, categorySlug: string): TimeEntry {
        const times = _.filter(
            this.times,
            (x) =>
                x.subcategorySlug === subcategorySlug &&
                x.categorySlug === categorySlug,
        );
        return _.orderBy(times, ['timeMs'], ['asc'])[0];
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

    private buildTimes(data: FirebaseData): void {
        const result = [];
        const times = data.times;
        for (const timeKey in times) {
            const time: Time = times[timeKey];
            result.push({
                userId: time.userId,
                userDisplayName: this.getUserDisplayName(time.userId),
                created: new Date(time.created),
                link: time.link,
                subcategorySlug: time.subcategorySlug,
                timeMs: Number(time.timeMs),
                timeElapsed: TimeUtils.msToElapsedTime(Number(time.timeMs)),
                note: time.note,
                categorySlug: time.categorySlug,
                timeId: timeKey,
                isCurrentRecord: false,
                isRecordImprovement: false,
            });
        }
        this.times = result.reverse();
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

    get users(): Users {
        return this.api.users;
    }
    get categories(): Category[] {
        return _.sortBy(this.api.categories, ['displayOrder']);
    }
}
