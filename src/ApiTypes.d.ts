declare module 'ApiTypes' {
    interface FirebaseData {
        gamedata: GameData;
        users: Users;
        times: Times;
        recordtypes: RecordTypes;
    }

    interface RecordTypes {
        [key: string]: RecordType;
    }

    interface RecordType {
        slug: string;
        name: string;
    }

    interface GameData {
        cups: {
            [key: string]: Cup;
        };
    }

    interface Times {}

    interface Cup {
        name: string;
        slug: string;
        tracks: {
            [key: string]: Track;
        };
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
