declare module 'FirebaseTypes' {
    interface FirebaseDataJSON {
        games: GameJSON[];
        users: UsersJSON;
    }

    export interface GameJSON {
        categories: CategoryJSON[];
        config: GameConfigJSON;
        gamedata: GameDataJSON;
        entries: EntriesJSON;
        userList: string[];
    }

    interface UsersJSON {
        [key: string]: UserJSON;
    }

    interface UserJSON {
        created: string;
        displayName: string;
    }

    interface CategoryJSON {
        subcategoryName: string;
        subcategories: SubcategoryJSON[];
        displayOrder: number;
        entryType: string;
        name: string;
        slug: string;
    }

    interface SubcategoryJSON {
        group: string;
        name: string;
        slug: string;
    }

    interface GameDataJSON {
        oldRecords: OldRecordCategoryJSON[];
        subcategoryGroups: SubcategoryGroupJSON[];
    }

    interface SubcategoryGroupJSON {
        name: string;
        slug: string;
        displayOrder: number;
    }

    export interface GameConfigJSON {
        discordChannel: string;
        discordChannelTest: string;
        gameName: string;
        gameSlug: string;
    }

    interface EntriesJSON {
        [key: string]: EntryJSON;
    }

    interface EntryJSON {
        created: string;
        link: string;
        note: string;
        score: string;
        subcategorySlug: string;
        categorySlug: string;
        userId: string;
        fileName?: string;
    }

    interface OldRecordCategoryJSON {
        categorySlug: string;
        subcategoryRecords: OldRecordSubcategoryJSON[];
    }

    interface OldRecordSubcategoryJSON {
        records: OldRecordScoreJSON[];
        subcategorySlug: string;
    }

    interface OldRecordScoreJSON {
        date: string;
        score: string;
    }
}
