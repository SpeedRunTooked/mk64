import { TimeJSON } from 'ApiTypes';
import { Category } from './Category';
import { Game } from './Game';
import { Subcategory } from './Subcategory';
import { User } from './User';

export abstract class Entry {
    public id: string;
    public created: Date;
    public link: string;
    public subcategory: Subcategory;
    public note: string;
    public category: Category;
    public isCurrentRecord: boolean;
    public isRecordImprovement: boolean;

    constructor(
        id: string,
        public timeJson: TimeJSON,
        public user: User,
        game: Game,
    ) {
        this.id = id;
        this.created = new Date(timeJson.created);
        this.link = timeJson.link;
        this.category = new Category(
            game.getCategoryJson(timeJson.categorySlug),
        );
        this.subcategory = new Subcategory(
            game.getSubcategoryJson(
                timeJson.categorySlug,
                timeJson.subcategorySlug,
            ),
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
