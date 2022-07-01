import { GameElement } from './Game';
import { Subcategory } from './Subcategory';
import { CategoryJSON, SubcategoryJSON } from 'FirebaseTypes';

export const DEFAULT_CATEGORY_JSON: CategoryJSON = {
    slug: '',
    name: '',
    displayOrder: 0,
    subcategories: [],
    subcategoryName: '',
};

export class Category implements GameElement {
    public subcategories: Subcategory[] = [];

    constructor(private categoryJson: CategoryJSON) {
        this.buildSubcategories();
    }

    private buildSubcategories(): void {
        if (this.categoryJson)
            for (const subcategoryJson of this.categoryJson.subcategories) {
                this.subcategories.push(new Subcategory(subcategoryJson));
            }
    }

    public getSubcategory(subcategorySlug: string): Subcategory | undefined {
        return this.subcategories.find(
            (subcategory) => subcategory.slug === subcategorySlug,
        );
    }

    public getSubcategoryJson(
        subcategorySlug: string,
    ): SubcategoryJSON | undefined {
        if (this.categoryJson)
            return this.categoryJson.subcategories.find(
                (subcategory) => subcategory.slug === subcategorySlug,
            );
    }

    get json(): CategoryJSON {
        return this.categoryJson;
    }

    get slug(): string {
        return this.json.slug;
    }

    get name(): string {
        return this.json.name;
    }

    get subcategoryName(): string {
        return this.json.subcategoryName;
    }
}
