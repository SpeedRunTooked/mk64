import { Game } from './Game';
import { EntryJSON } from 'FirebaseTypes';
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
    public score: number;
    public formattedScore: string;

    constructor(
        public id: string,
        protected entryJson: EntryJSON,
        public userId: string,
        game: Game,
    ) {
        const categoryJson = game.getCategory(entryJson.categorySlug);
        const subcategoryJson = game.getSubcategory(entryJson.subcategorySlug);

        this.created = new Date(entryJson.created);
        this.link = entryJson.link;

        this.category = categoryJson
            ? categoryJson
            : new Category(DEFAULT_CATEGORY_JSON);

        this.subcategory = subcategoryJson
            ? subcategoryJson
            : new Subcategory(DEFAULT_SUBCATEGORY_JSON);

        this.note = entryJson.note;

        this.score = Number(entryJson.score);

        this.isCurrentRecord = false;
        this.isRecordImprovement = false;
        this.formattedScore = String(this.score);
    }

    get json(): EntryJSON {
        return this.entryJson;
    }

    get runSlug(): string {
        return this.category.slug + '-' + this.subcategory.slug;
    }
}
