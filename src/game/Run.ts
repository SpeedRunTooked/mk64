import { Category } from './Category';
import { Subcategory } from './Subcategory';

export class Run {
    public attempts = 1;

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
