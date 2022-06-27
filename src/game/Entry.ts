import { TimeJSON } from 'ApiTypes';
import { Category } from './Category';
import { Game } from './Game';
import { Subcategory } from './Subcategory';

export abstract class Entry {
    public userId: string;
    public userDisplayName: string;
    public created: Date;
    public link: string;
    public subcategory: string;
    public note: string;
    public category: Category;
    public id: string;
    public isCurrentRecord: boolean;
    public isRecordImprovement: boolean;

    constructor(id: string, public data: TimeJSON, game: Game) {
        this.id = id;
        this.userId = data.userId;
        this.userDisplayName = game.getUserDisplayName(data.userId);
        this.created = new Date(data.created);
        this.link = data.link;
        this.subcategory = new Subcategory(
            game.getSubcategoryJson(data.categorySlug, data.subcategorySlug),
        );
        this.note = data.note;
        this.category = new Category(game.getCategoryJson(data.categorySlug));
        this.isCurrentRecord = false;
        this.isRecordImprovement = false;
    }

    get json() {
        return this.data;
    }
}
