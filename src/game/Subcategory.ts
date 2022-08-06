import { SubcategoryJSON } from 'FirebaseTypes';

// The default subcategory is just used for stricter type safety throughout
export const DEFAULT_SUBCATEGORY_JSON: SubcategoryJSON = {
    slug: 'DEFAULT_SUBCATEGORY',
    name: '',
    group: '',
};

export class Subcategory {
    public slug: string;
    public name: string;
    public group: string;

    constructor(subcategoryJson: SubcategoryJSON) {
        this.slug = subcategoryJson.slug;
        this.name = subcategoryJson.name;
        this.group = subcategoryJson.group;
    }

    get json(): SubcategoryJSON {
        return {
            slug: this.slug,
            name: this.name,
            group: this.group,
        };
    }
}
