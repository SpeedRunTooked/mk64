import { Game } from './Game';
import { Entry } from './Entry';
import { EntryJSON } from 'FirebaseTypes';

export class Score extends Entry {
    public formattedScore: string;
    public entryTypeSlug = 'score';

    constructor(id: string, entryJson: EntryJSON, userId: string, game: Game) {
        super(id, entryJson, userId, game);
        this.formattedScore = Score.addCommas(String(this.score));
    }

    public static addCommas(num: string): string {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
}
