declare module 'ApiTypes' {
    interface FirebaseData {
        gamedata: GameData;
        users: Users;
        times: string[];
    }

    interface GameData {
        cups: {
            [key: string]: Cup;
        };
    }

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
