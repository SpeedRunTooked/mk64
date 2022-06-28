import { CategoryJSON } from 'ApiTypes';

export class Category {
    constructor(public categoryJson: CategoryJSON) {}

    get json(): CategoryJSON {
        return this.categoryJson;
    }

    get slug(): string {
        return this.json.slug;
    }

    get name(): string {
        return this.json.name;
    }
}
