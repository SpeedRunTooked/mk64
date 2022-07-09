import { Subcategory } from './Subcategory';
import { CategoryJSON } from 'FirebaseTypes';

// The default category is just used for stricter type safety throughout
export const DEFAULT_CATEGORY_JSON: CategoryJSON = {
    slug: '',
    name: '',
    displayOrder: 0,
    subcategories: [],
    subcategoryName: '',
    entryType: '',
};

export class Category {
    public subcategories: Subcategory[] = [];
    public name: string;
    public slug: string;
    public subcategoryName: string;
    public displayOrder: number;
    public entryType: string;

    constructor(categoryJson: CategoryJSON) {
        this.buildSubcategories(categoryJson);
        this.slug = categoryJson.slug;
        this.name = categoryJson.name;
        this.subcategoryName = categoryJson.subcategoryName;
        this.displayOrder = categoryJson.displayOrder;
        this.entryType = categoryJson.entryType;
    }

    private buildSubcategories(categoryJson: CategoryJSON): void {
        for (const subcategoryJson of categoryJson.subcategories) {
            this.subcategories.push(new Subcategory(subcategoryJson));
        }
    }

    public getSubcategory(subcategorySlug: string): Subcategory | undefined {
        return this.subcategories.find(
            (subcategory) => subcategory.slug === subcategorySlug,
        );
    }

    get json(): CategoryJSON {
        return {
            name: this.name,
            slug: this.slug,
            subcategoryName: this.subcategoryName,
            subcategories: this.subcategories,
            displayOrder: this.displayOrder,
            entryType: this.entryType,
        };
    }
}
