import _ from 'lodash';
import { UserJSON } from 'ApiTypes';
import { Category } from './Category';
import { Run } from './Run';
import { Subcategory } from './Subcategory';
import { Time } from './Time';

export class User {
    public times: Time[] = [];
    public runs: Run[] = [];
    public currentRecords: Time[] = [];
    public recordImprovements: Time[] = [];
    public currentRecordTotal = 0;
    public recordImprovementTotal = 0;
    public favoriteRun: Run | null = null;

    constructor(public id: string, public json: UserJSON) {
        this.buildRecords();
        this.buildRuns();
    }

    public getRecord(
        subcategorySlug: string,
        categorySlug: string,
    ): Time | null {
        const filtered = this.times.filter((x) => {
            return (
                x.subcategory.slug === subcategorySlug &&
                x.category.slug === categorySlug
            );
        });
        return _.minBy(filtered, 'timeMs') || null;
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
        this.favoriteRun = _.maxBy(this.runs, 'attempts') || null;
    }

    get displayName(): string {
        return this.json.displayName;
    }
}
