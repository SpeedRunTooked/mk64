import _ from 'lodash';
import { Run } from './Run';
import { Time } from './Time';
import { Category } from './Category';
import { UserJSON } from 'FirebaseTypes';
import { Subcategory } from './Subcategory';

export class User {
    public runs: Run[] = [];
    public entries: Time[] = [];
    public currentRecordTotal = 0;
    public recordImprovementTotal = 0;
    public currentRecords: Time[] = [];
    public favoriteRun: Run | undefined;
    public recordImprovements: Time[] = [];

    constructor(public id: string, public json: UserJSON) {}

    public getRecord(
        categorySlug: string,
        subcategorySlug: string,
    ): Time | undefined {
        const filtered = this.entries.filter((time) => {
            return (
                time.subcategory.slug === subcategorySlug &&
                time.category.slug === categorySlug
            );
        });
        return _.minBy(filtered, 'timeMs');
    }

    public appendTimes(times: Time[]): void {
        this.entries = times.filter((time) => time.user === this);
    }

    public generateStats(): void {
        this.buildRecords();
        this.buildRuns();
        this.setFavoriteRun();
    }

    private buildRecords(): void {
        this.currentRecords = _.filter(
            this.entries,
            (time) => time.isCurrentRecord,
        );
        this.currentRecordTotal = this.currentRecords.length;
        this.recordImprovements = _.filter(
            this.entries,
            (time) => time.isRecordImprovement,
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

    private setFavoriteRun(): void {
        this.favoriteRun = _.maxBy(this.runs, 'attempts') || undefined;
    }

    get displayName(): string {
        return this.json.displayName;
    }
}
