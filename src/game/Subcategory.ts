import { SubcategoryJSON } from 'ApiTypes';

export const defaultSubcategoryJson: SubcategoryJSON = {
    group: '',
    name: '',
    slug: '',
};

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

    get group(): string {
        return this.json.group;
    }
}
