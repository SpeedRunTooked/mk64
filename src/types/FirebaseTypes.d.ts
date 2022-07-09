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

    export interface GameConfigJSON {
        discordChannel: string;
        discordChannelTest: string;
    }

    interface GameDataJSON {
        oldRecords: OldRecordCategoryJSON[];
        subcategoryGroups: SubcategoryGroupJSON[];
    }

    interface GameElementJSON {
        slug: string;
        name: string;
    }

    interface OldRecordCategoryJSON {
        categorySlug: string;
        subcategoryRecords: OldRecordSubcategoryJSON[];
    }

    interface OldRecordSubcategoryJSON {
        records: OldRecordTimeJSON[];
        subcategorySlug: string;
    }

    interface OldRecordTimeJSON {
        date: string;
        time: string;
    }

    interface CategoryJSON extends GameElementJSON {
        subcategoryName: string;
        subcategories: SubcategoryJSON[];
        displayOrder: number;
        entryType: string;
    }

    interface SubcategoryJSON extends GameElementJSON {
        group: string;
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
    }

    interface SubcategoryGroupJSON {
        name: string;
        slug: string;
        displayOrder: number;
    }

    interface UsersJSON {
        [key: string]: UserJSON;
    }

    interface UserJSON {
        created: string;
        displayName: string;
    }
}
