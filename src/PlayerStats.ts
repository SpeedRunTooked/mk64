import _ from 'lodash';
import { Category } from './game/Category';
import { Run } from './game/Run';
import { Subcategory } from './game/Subcategory';
import { Time } from './game/Time';

export class PlayerStats {
    public currentRecords: Time[] = [];
    public currentRecordTotal = 0;
    public recordImprovements: Time[] = [];
    public recordImprovementTotal = 0;
    public subcategoryMap: { [key: string]: number } = {};
    public runs: Run[] = [];

    constructor(public playerId: string, public times: Time[]) {
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

    public getFavoriteRun(): Run | null {
        const run = _.maxBy(this.runs, 'attems');
        return run || null;
    }
}
