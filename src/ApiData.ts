import { FirebaseData, Track } from 'ApiTypes';

export class ApiData {
    public data;
    public tracks: Track[] = [];

    constructor(data: FirebaseData) {
        this.data = {
            gamedata: data?.gamedata || {},
            users: data?.users || {},
            times: data?.times || {},
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

    private buildTrackList(data: FirebaseData) {
        const result = [];
        const cups = data.gamedata.cups;
        for (const cup in cups) {
            const tracks = cups[cup].tracks;
            for (const track in tracks) {
                result.push(tracks[track]);
            }
        }
        this.tracks = result;
    }
    get cups() {
        return this.data.gamedata.cups;
    }
    get users() {
        return this.data.users;
    }
}
