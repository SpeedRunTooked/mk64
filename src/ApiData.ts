import { FirebaseData, Track } from 'ApiTypes';

export class ApiData {
    public api;
    public tracks: Track[] = [];

    constructor(data: FirebaseData) {
        this.api = {
            gamedata: data?.gamedata || {},
            users: data?.users || {},
            times: data?.times || {},
            recordtypes: data?.recordtypes || {},
        };
        if (data) {
            this.buildTrackList(data);
        }
    }

    public getUserDisplayName(userId: string) {
        return this.users[userId]?.displayName;
    }

    public getTrackName(trackSlug: string) {
        return this.tracks.find((track) => track.slug === trackSlug)?.name;
    }

    public getRecordType(recordSlug: string) {
        for (const key in this.recordtypes) {
            const type = this.recordtypes[key];
            if (type.slug === recordSlug) return type.name;
        }
        return '';
    }

    private buildTrackList(data: FirebaseData) {
        const result = [];
        const cups = data.gamedata.cups;
        for (const cupKey in cups) {
            const tracks = cups[cupKey].tracks;
            for (const trackKey in tracks) {
                result.push(tracks[trackKey]);
            }
        }
        this.tracks = result;
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
