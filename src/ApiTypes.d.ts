declare module 'ApiTypes' {
    interface FirebaseData {
        gamedata: GameData;
        users: Users;
        times: Times;
        recordtypes: RecordType[];
    }

    interface RecordType {
        slug: string;
        name: string;
    }

    interface GameData {
        cups: Cup[];
    }

    interface Times {
        [key: string]: Time;
    }

    interface Time {
        created: string;
        link: string;
        note: string;
        timeMs: string;
        trackSlug: string;
        type: string;
        userId: string;
    }

    interface Cup {
        name: string;
        slug: string;
        tracks: Track[];
    }

    interface Track {
        name: string;
        slug: string;
    }

    interface Users {
        [key: string]: User;
    }

    interface User {
        created: string;
        displayName: string;
    }
}
