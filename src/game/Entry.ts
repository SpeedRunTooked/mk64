import { TimeJSON } from 'ApiTypes';
import { Category } from './Category';
import { Game } from './Game';
import { Subcategory } from './Subcategory';

export abstract class Entry {
    public userId: string;
    public userDisplayName: string;
    public created: Date;
    public link: string;
    public subcategory: Subcategory;
    public note: string;
    public category: Category;
    public id: string;
    public isCurrentRecord: boolean;
    public isRecordImprovement: boolean;

    constructor(id: string, public timeJson: TimeJSON, game: Game) {
        this.id = id;
        this.userId = timeJson.userId;
        this.userDisplayName = game.getUserDisplayName(timeJson.userId);
        this.created = new Date(timeJson.created);
        this.link = timeJson.link;
        this.subcategory = new Subcategory(
            game.getSubcategoryJson(
                timeJson.categorySlug,
                timeJson.subcategorySlug,
            ),
        );
        this.note = timeJson.note;
        this.category = new Category(
            game.getCategoryJson(timeJson.categorySlug),
        );
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
