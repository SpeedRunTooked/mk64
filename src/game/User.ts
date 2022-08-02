import _ from 'lodash';
import { Run } from './Run';
import { Category } from './Category';
import { UserJSON } from 'FirebaseTypes';
import { Subcategory } from './Subcategory';
import { Entry } from './Entry';
import { Game } from './Game';

export class User {
    public runs: Run[] = [];
    public entries: Entry[] = [];
    public currentRecordTotal = 0;
    public recordImprovementTotal = 0;
    public totalScore = 0;
    public currentRecords: Entry[] = [];
    public bestPerCategory: Entry[] = [];
    public favoriteRun: Run | undefined;
    public recordImprovements: Entry[] = [];

    constructor(public id: string, public json: UserJSON, public game: Game) {}

    public getRecord(
        category: Category,
        subcategorySlug: string,
    ): Entry | undefined {
        const filtered = this.entries.filter((entry) => {
            return (
                entry.subcategory.slug === subcategorySlug &&
                entry.category.slug === category.slug
            );
        });

        if (category.entryType === 'timeMs') {
            return _.minBy(filtered, 'score');
        } else {
            return _.maxBy(filtered, 'score');
        }
    }

    public appendEntries(entries: Entry[]): void {
        this.entries = entries.filter((entry) => entry.userId === this.id);
    }

    public generateStats(): void {
        this.buildRecords();
        this.buildRuns();
        this.buildScore();
        this.setFavoriteRun();
    }

    private buildRecords(): void {
        this.currentRecords = _.filter(
            this.entries,
            (entry) => entry.isCurrentRecord,
        );
        this.currentRecordTotal = this.currentRecords.length;
        this.recordImprovements = _.filter(
            this.entries,
            (entry) => entry.isRecordImprovement,
        );
        this.recordImprovementTotal = this.recordImprovements.length;
    }

    private buildRuns(): void {
        for (const time of this.entries) {
            const currentRun = this.runs.find(
                (run) => run.slug === time.runSlug,
            );
            if (currentRun) {
                currentRun.increaseCounter();
            } else {
                this.runs.push(
                    new Run(
                        new Category(time.category.json),
                        new Subcategory(time.subcategory.json),
                    ),
                );
            }
        }
    }

    private buildScore(): void {
        for (const category of this.game.categories) {
            const subcategories = this.game.getSubcategories(category.slug);
            for (const subcategory of subcategories) {
                const best = this.getRecord(category, subcategory.slug);
                if (best) {
                    this.bestPerCategory.push(best);
                }
            }
        }
        for (const entry of this.bestPerCategory) {
            if (entry.category.entryType === 'score') {
                this.totalScore += entry.score;
            }
        }
    }

    private setFavoriteRun(): void {
        this.favoriteRun = _.maxBy(this.runs, 'attempts') || undefined;
    }

    get displayName(): string {
        return this.json.displayName;
    }
}
