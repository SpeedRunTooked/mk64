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

    constructor(public id: string, public json: UserJSON) {}

    public getRecord(
        subcategorySlug: string,
        categorySlug: string,
    ): Time | undefined {
        const filtered = this.times.filter((time) => {
            return (
                time.subcategory.slug === subcategorySlug &&
                time.category.slug === categorySlug
            );
        });
        return _.minBy(filtered, 'timeMs');
    }

    public appendTimes(times: Time[]): void {
        this.times = times.filter((time) => time.user === this);
    }

    public generateStats(): void {
        this.buildRecords();
        this.buildRuns();
        this.setFavoriteRun();
    }

    private buildRecords(): void {
        this.currentRecords = _.filter(
            this.times,
            (time) => time.isCurrentRecord,
        );
        this.currentRecordTotal = this.currentRecords.length;
        this.recordImprovements = _.filter(
            this.times,
            (time) => time.isRecordImprovement,
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
    }

    private setFavoriteRun(): void {
        this.favoriteRun = _.maxBy(this.runs, 'attempts') || undefined;
    }

    get displayName(): string {
        return this.json.displayName;
    }
}
