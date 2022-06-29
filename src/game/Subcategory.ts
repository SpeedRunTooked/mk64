import { SubcategoryJSON } from 'ApiTypes';

export class Subcategory {
    constructor(public subcategoryJson: SubcategoryJSON) {}

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
