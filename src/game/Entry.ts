import { TimeJSON } from 'ApiTypes';
import { Category } from './Category';
import { Game } from './Game';
import { Subcategory } from './Subcategory';
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
        this.created = new Date(timeJson.created);
        this.link = timeJson.link;
        this.category = new Category(
            game.getCategoryJson(timeJson.categorySlug),
        );
        this.subcategory = new Subcategory(
            this.category.getSubcategoryJson(timeJson.subcategorySlug),
        );
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
