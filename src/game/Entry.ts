import { Game } from './Game';
import { User } from './User';
import { TimeJSON } from 'FirebaseTypes';
import { Category, DEFAULT_CATEGORY_JSON } from './Category';
import { DEFAULT_SUBCATEGORY_JSON, Subcategory } from './Subcategory';

export abstract class Entry {
    public link: string;
    public note: string;
    public created: Date;
    public category: Category;
    public isCurrentRecord: boolean;
    public subcategory: Subcategory;
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
            : new Category(DEFAULT_CATEGORY_JSON);

        this.subcategory = subcategoryJson
            ? subcategoryJson
            : new Subcategory(DEFAULT_SUBCATEGORY_JSON);

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
