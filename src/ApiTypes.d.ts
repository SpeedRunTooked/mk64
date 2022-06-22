declare module 'ApiTypes' {
    interface FirebaseData {
        gamedata: GameData;
        users: Users;
        times: Times;
        categories: Category[];
    }

    interface Category {
        slug: string;
        name: string;
        subcategoryName: string;
        subcategories: Subcategory[];
    }

    interface Subcategory {
        group: string;
        name: string;
        slug: string;
    }

    interface GameData {
        cups: Cup[];
        subcategoryGroups: SubcategoryGroup[];
    }

    interface Times {
        [key: string]: Time;
    }

    interface Time {
        created: string;
        link: string;
        note: string;
        timeMs: string;
        subcategorySlug: string;
        categorySlug: string;
        userId: string;
    }

    interface Cup {
        name: string;
        slug: string;
        tracks: Subcategory[];
    }

    interface SubcategoryGroup {
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
