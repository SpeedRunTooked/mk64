import { FirebaseData, Track } from 'ApiTypes';
import { TimeUtils } from './utils/TimeUtils';
import _ from 'lodash';

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
}

export class ApiData {
    public api;
    public tracks: Track[] = [];
    public times: TimeEntry[] = [];

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
        }
    }

    public getUserDisplayName(userId: string) {
        return this.users[userId]?.displayName;
    }

    public getTrackName(trackSlug: string) {
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
            });
        }
        this.times = result.reverse();
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
