import { TimeJSON } from 'FirebaseTypes';
import { Category, defaultCategoryJson } from './Category';
import { Game } from './Game';
import { defaultSubcategoryJson, Subcategory } from './Subcategory';
import { User } from './User';

export abstract class Entry {
    public created: Date;
    public link: string;
    public subcategory: Subcategory;
    public note: string;
    public category: Category;
    public isCurrentRecord: boolean;
    public isRecordImprovement: boolean;

    constructor(
        public id: string,
        protected timeJson: TimeJSON,
        public user: User,
        game: Game,
    ) {
        const categoryJson = game.getCategory(timeJson.categorySlug);
        const subcategoryJson = game.getSubcategory(timeJson.subcategorySlug);

        this.created = new Date(timeJson.created);
        this.link = timeJson.link;

        this.category = categoryJson
            ? categoryJson
            : new Category(defaultCategoryJson);

        this.subcategory = subcategoryJson
            ? subcategoryJson
            : new Subcategory(defaultSubcategoryJson);

        this.note = timeJson.note;
        this.isCurrentRecord = false;
        this.isRecordImprovement = false;
    }

    get json(): TimeJSON {
        return this.timeJson;
    }

    get runSlug(): string {
        return this.category.slug + '-' + this.subcategory.slug;
    }
}
