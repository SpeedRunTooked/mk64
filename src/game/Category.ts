import { CategoryJSON, SubcategoryJSON } from 'ApiTypes';
import { Subcategory } from './Subcategory';

export class Category {
    public subcategories: Subcategory[] = [];

    constructor(private categoryJson: CategoryJSON) {
        this.buildSubcategories();
    }

    private buildSubcategories(): void {
        for (const subcategoryJson of this.categoryJson.subcategories) {
            this.subcategories.push(new Subcategory(subcategoryJson));
        }
    }

    public subcategoryExists(subcategory: Subcategory): boolean {
        return (
            this.subcategories.filter((x) => x.slug === subcategory.slug)
                .length > 0
        );
    }

    public getSubcategory(subcategorySlug: string): Subcategory | null {
        return (
            this.subcategories.find(
                (subcategory) => subcategory.slug === subcategorySlug,
            ) || null
        );
    }

    public getSubcategoryJson(subcategorySlug: string): SubcategoryJSON {
        return this.categoryJson.subcategories.filter(
            (subcategory) => subcategory.slug === subcategorySlug,
        )[0];
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
