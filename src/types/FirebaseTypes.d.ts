declare module 'FirebaseTypes' {
    interface FirebaseDataJSON {
        categories: CategoryJSON[];
        gamedata: GameDataJSON;
        entries: TimeJSON[];
        users: UserJSON[];
    }

    interface GameDataJSON {
        oldRecords: OldRecordCategoryEntry[];
        subcategoryGroups: SubcategoryGroupJSON[];
    }

    interface GameElementJSON {
        slug: string;
        name: string;
    }

    interface OldRecordCategoryEntry {
        categorySlug: string;
        subcategoryRecords: OldRecordSubcategoryEntry[];
    }

    interface OldRecordTimeEntry {
        date: string;
        time: string;
    }

    interface OldRecordSubcategoryEntry {
        records: OldRecordTimeEntry[];
        subcategorySlug: string;
    }

    interface CategoryJSON extends GameElementJSON {
        subcategoryName: string;
        subcategories: SubcategoryJSON[];
        displayOrder: number;
    }

    interface SubcategoryJSON extends GameElementJSON {
        group: string;
    }

    interface TimeJSON extends EntryJSON {
        timeMs: string;
    }

    interface EntryJSON {
        created: string;
        link: string;
        note: string;
        subcategorySlug: string;
        categorySlug: string;
        userId: string;
    }

    interface SubcategoryGroupJSON {
        name: string;
        slug: string;
        displayOrder: number;
    }

    interface UserJSON {
        created: string;
        displayName: string;
    }
}
