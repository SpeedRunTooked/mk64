import { FirebaseData, Track } from 'ApiTypes';
import { TimeUtils } from './utils/TimeUtils';
import _ from 'lodash';
import { PlayerStats } from './PlayerStats';

export interface TimeEntry {
    userId: string;
    userDisplayName: string;
    created: Date;
    link: string;
    trackSlug: string;
    timeMs: number;
    timeElapsed: string;
    note: string;
    recordType: string;
    timeId: string;
    isCurrentRecord: boolean;
    isRecordImprovement: boolean;
}

export class ApiData {
    public api;
    public tracks: Track[] = [];
    public times: TimeEntry[] = [];
    public playerStats: PlayerStats[] = [];

    constructor(data: FirebaseData) {
        this.api = {
            gamedata: data?.gamedata || {},
            users: data?.users || {},
            times: data?.times || {},
            recordtypes: data?.recordtypes || {},
        };
        if (data) {
            this.buildTrackList(data);
            this.buildTimes(data);
            this.buildCurrentRecords();
            this.buildRecordImprovements();
            this.buildPlayerStats();
        }
    }

    public getUserDisplayName(userId: string) {
        return this.users[userId]?.displayName;
    }

    public getTrackName(trackSlug: string) {
        if (trackSlug === 'none') return 'None yet!';
        return this.tracks.find((track) => track.slug === trackSlug)?.name;
    }

    public getRecordType(recordSlug: string) {
        for (const type of this.recordtypes) {
            if (type.slug === recordSlug) return type.name;
        }
        return '';
    }

    public getRecentTimes(num: number) {
        const sorted = _.orderBy(this.times, ['created'], ['desc']);
        return sorted.slice(0, num);
    }

    public getPlayerStats(userId: string): PlayerStats | null {
        return this.playerStats.filter((x) => x.playerId === userId)[0] || null;
    }

    public isRecord(time: TimeEntry) {
        const times = this.times.filter((x) => {
            return (
                x.trackSlug === time.trackSlug &&
                x.recordType === time.recordType
            );
        });

        if (times.length === 0) return true;

        const record = _.minBy(times, 'timeMs') as TimeEntry;
        return time.timeId === record.timeId;
    }

    public getRecord(trackSlug: string, recordType: string): TimeEntry {
        const times = _.filter(
            this.times,
            (x) => x.trackSlug === trackSlug && x.recordType === recordType,
        );
        return _.orderBy(times, ['timeMs'], ['asc'])[0];
    }

    private buildTrackList(data: FirebaseData) {
        const result = [];
        const cups = data.gamedata.cups;
        for (const cup of cups) {
            for (const track of cup.tracks) {
                result.push(track);
            }
        }
        this.tracks = result;
    }

    private buildPlayerStats() {
        for (const user in this.api.users) {
            const player = new PlayerStats(
                user,
                this.times.filter((x) => x.userId === user),
            );
            this.playerStats.push(player);
        }
    }

    private buildTimes(data: FirebaseData) {
        const result = [];
        const times = data.times;
        for (const timeKey in times) {
            const time = times[timeKey];
            result.push({
                userId: time.userId,
                userDisplayName: this.getUserDisplayName(time.userId),
                created: new Date(time.created),
                link: time.link,
                trackSlug: time.trackSlug,
                timeMs: Number(time.timeMs),
                timeElapsed: TimeUtils.msToElapsedTime(Number(time.timeMs)),
                note: time.note,
                recordType: time.type,
                timeId: timeKey,
                isCurrentRecord: false,
                isRecordImprovement: false,
            });
        }
        this.times = result.reverse();
    }

    private buildCurrentRecords() {
        const sorted = _.orderBy(this.times, ['timeMs'], ['asc']);
        const recordArr: string[] = [];
        for (const time of sorted) {
            const key = time.recordType + time.trackSlug;
            if (recordArr.indexOf(key) === -1) {
                time.isCurrentRecord = true;
                recordArr.push(key);
            }
        }
    }

    private buildRecordImprovements() {
        const sorted = _.orderBy(this.times, ['created'], ['asc']);
        const recordMap: { [key: string]: number } = {};
        for (const time of sorted) {
            const key = time.recordType + time.trackSlug;
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

    get cups() {
        return this.api.gamedata.cups;
    }
    get users() {
        return this.api.users;
    }
    get recordtypes() {
        return this.api.recordtypes;
    }
}
