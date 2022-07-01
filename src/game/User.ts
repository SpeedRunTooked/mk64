import _ from 'lodash';
import { Run } from './Run';
import { Time } from './Time';
import { Category } from './Category';
import { UserJSON } from 'FirebaseTypes';
import { Subcategory } from './Subcategory';

export class User {
    public runs: Run[] = [];
    public times: Time[] = [];
    public currentRecordTotal = 0;
    public recordImprovementTotal = 0;
    public currentRecords: Time[] = [];
    public favoriteRun: Run | undefined;
    public recordImprovements: Time[] = [];

    constructor(public id: string, public json: UserJSON) {
        this.buildRecords();
        this.buildRuns();
    }

    public getRecord(
        subcategorySlug: string,
        categorySlug: string,
    ): Time | undefined {
        const filtered = this.times.filter((x) => {
            return (
                x.subcategory.slug === subcategorySlug &&
                x.category.slug === categorySlug
            );
        });
        return _.minBy(filtered, 'timeMs');
    }

    public buildStats(times: Time[]): void {
        this.times = times.filter((time) => time.user === this);
        this.buildRecords();
        this.buildRuns();
    }

    private buildRecords(): void {
        this.currentRecords = _.filter(this.times, (x) => x.isCurrentRecord);
        this.currentRecordTotal = this.currentRecords.length;
        this.recordImprovements = _.filter(
            this.times,
            (x) => x.isRecordImprovement,
        );
        this.recordImprovementTotal = this.recordImprovements.length;
    }

    private buildRuns(): void {
        for (const time of this.times) {
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
        this.favoriteRun = _.maxBy(this.runs, 'attempts') || undefined;
    }

    get displayName(): string {
        return this.json.displayName;
    }
}
