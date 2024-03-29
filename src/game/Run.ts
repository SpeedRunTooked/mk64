import { OldRecordScoreJSON } from 'FirebaseTypes';
import { Category } from './Category';
import { Entry } from './Entry';
import { Subcategory } from './Subcategory';

/* A Run represents a combination of category + subcategory which can be attempted to create Entries */

export class Run {
    public attempts = 1;
    public timesContested = 0;
    public record: Entry | null = null;
    public oldRecords: OldRecordScoreJSON[] | undefined;

    constructor(public category: Category, public subcategory: Subcategory) {}

    public increaseCounter(): void {
        this.attempts++;
    }

    get displayName(): string {
        return this.category.name + ' - ' + this.subcategory.name;
    }

    get slug(): string {
        return this.category.slug + '-' + this.subcategory.slug;
    }
}
