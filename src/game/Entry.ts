import { TimeJSON } from 'ApiTypes';
import { Game } from './Game';

export abstract class Entry {
    public userId: string;
    public userDisplayName: string;
    public created: Date;
    public link: string;
    public subcategorySlug: string;
    public note: string;
    public categorySlug: string;
    public id: string;
    public isCurrentRecord: boolean;
    public isRecordImprovement: boolean;

    constructor(id: string, data: TimeJSON, game: Game) {
        this.id = id;
        this.userId = data.userId;
        this.userDisplayName = game.getUserDisplayName(data.userId);
        this.created = new Date(data.created);
        this.link = data.link;
        this.subcategorySlug = data.subcategorySlug;
        this.note = data.note;
        this.categorySlug = data.categorySlug;
        this.isCurrentRecord = false;
        this.isRecordImprovement = false;
    }
}
