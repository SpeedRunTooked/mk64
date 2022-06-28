import { SubcategoryGroupJSON, SubcategoryJSON } from 'ApiTypes';

export class Subcategory {
    constructor(public subcategoryJson: SubcategoryJSON) {}

    get json() {
        return this.subcategoryJson;
    }
    get slug() {
        return this.json.slug;
    }

    get name() {
        return this.json.name;
    }
}
