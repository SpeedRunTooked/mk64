import { SubcategoryJSON } from 'ApiTypes';

export class Subcategory {
    constructor(private subcategoryJson: SubcategoryJSON) {}

    get json(): SubcategoryJSON {
        return this.subcategoryJson;
    }
    get slug(): string {
        return this.json.slug;
    }

    get name(): string {
        return this.json.name;
    }
}
