import { CategoryJSON } from 'FirebaseTypes';

// The default category is just used for stricter type safety throughout
export const DEFAULT_CATEGORY_JSON: CategoryJSON = {
    slug: '',
    name: '',
    displayOrder: 0,
    subcategoryList: [],
    subcategoryName: '',
    entryType: '',
};

export class Category {
    public subcategoryList: string[] = [];
    public name: string;
    public slug: string;
    public subcategoryName: string;
    public displayOrder: number;
    public entryType: string;

    constructor(categoryJson: CategoryJSON) {
        this.subcategoryList = categoryJson.subcategoryList;
        this.slug = categoryJson.slug;
        this.name = categoryJson.name;
        this.subcategoryName = categoryJson.subcategoryName;
        this.displayOrder = categoryJson.displayOrder;
        this.entryType = categoryJson.entryType;
    }

    get json(): CategoryJSON {
        return {
            name: this.name,
            slug: this.slug,
            subcategoryName: this.subcategoryName,
            subcategoryList: this.subcategoryList,
            displayOrder: this.displayOrder,
            entryType: this.entryType,
        };
    }
}
