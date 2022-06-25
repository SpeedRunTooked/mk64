declare module 'ApiTypes' {
    interface DataJSON {
        users: UsersJSON;
        times: TimesJSON;
        categories: CategoryJSON[];
        subcategoryGroups: SubcategoryGroupJSON[];
    }

    interface CategoryJSON {
        slug: string;
        name: string;
        subcategoryName: string;
        subcategories: SubcategoryJSON[];
        displayOrder: number;
    }

    interface SubcategoryJSON {
        group: string;
        name: string;
        slug: string;
    }

    interface TimesJSON {
        [key: string]: TimeJSON;
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

    interface UsersJSON {
        [key: string]: UserJSON;
    }

    interface UserJSON {
        created: string;
        displayName: string;
    }
}
