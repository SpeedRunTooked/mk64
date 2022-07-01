import { GameElement } from './Game';
import { SubcategoryJSON } from 'FirebaseTypes';

export const DEFAULT_SUBCATEGORY_JSON: SubcategoryJSON = {
    slug: '',
    name: '',
    group: '',
};

export class Subcategory implements GameElement {
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
