declare module 'FirebaseTypes' {
    interface FirebaseDataJSON {
        categories: CategoryJSON[];
        gamedata: GameDataJSON;
        times: TimeJSON[];
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

    interface TimeJSON {
        created: string;
        link: string;
        note: string;
        timeMs: string;
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
