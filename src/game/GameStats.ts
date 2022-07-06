import { OldRecordCategoryEntry } from 'FirebaseTypes';
import _ from 'lodash';
import { Game } from './Game';
import { Run } from './Run';
import { Subcategory } from './Subcategory';
import { Time } from './Time';

export interface MostPlayedSubcategory {
    subcategory: Subcategory;
    attempts: number;
}

export class GameStats {
    public runs: Run[] = [];
    public oldRecords: OldRecordCategoryEntry[] = [];

    constructor(
        game: Game,
        times: Time[],
        oldRecords: OldRecordCategoryEntry[],
    ) {
        this.buildRunList(game, times, oldRecords);
        this.buildMostContestedSubcategories(game);
    }

    public getMostPopularRuns(): Run[] {
        return _.orderBy(this.runs, ['attempts'], ['desc']);
    }

    public getMostContested(): Run[] {
        return _.orderBy(
            this.runs,
            ['timesContested', 'attempts'],
            ['desc', 'desc'],
        );
    }

    public getMostPlayedSubcategories(
        categorySlug?: string,
    ): MostPlayedSubcategory[] {
        let runs = this.runs;
        const mostPlayedSubcategories: MostPlayedSubcategory[] = [];

        if (categorySlug) {
            runs = this.runs.filter(
                (run) => run.category.slug === categorySlug,
            );
        }

        for (const run of runs) {
            const mostPlayedEntry = mostPlayedSubcategories.find(
                (mostPlayed) =>
                    mostPlayed.subcategory.slug === run.subcategory.slug,
            );

            if (mostPlayedEntry) {
                mostPlayedEntry.attempts += run.attempts;
            } else {
                mostPlayedSubcategories.push({
                    subcategory: run.subcategory,
                    attempts: run.attempts,
                });
            }
        }
        return _.orderBy(mostPlayedSubcategories, ['attempts'], ['desc']);
    }

    private buildMostContestedSubcategories(game: Game): void {
        for (const run of this.runs) {
            run.timesContested = this.calculateMostContested(
                game.getTimes(run.category.slug, run.subcategory.slug),
            );
        }
    }

    private calculateMostContested(timeList: Time[]): number {
        const recordImprovements = _.filter(
            timeList,
            (time) => time.isRecordImprovement === true,
        );

        const recordImprovementsSorted = _.orderBy(
            recordImprovements,
            ['created'],
            ['asc'],
        );

        let count = 0;

        for (let i = 0; i < recordImprovementsSorted.length; i++) {
            if (i > 0) {
                if (
                    recordImprovements[i].user !==
                    recordImprovements[i - 1].user
                )
                    count++;
            }
        }

        return count;
    }

    private buildRunList(
        game: Game,
        times: Time[],
        oldRecords: OldRecordCategoryEntry[],
    ): void {
        for (const time of times) {
            const existingRun = this.runs.find(
                (run) =>
                    run.category == time.category &&
                    run.subcategory === time.subcategory,
            );
            if (existingRun) {
                existingRun.increaseCounter();
            } else {
                this.runs.push(new Run(time.category, time.subcategory));
            }
        }
        this.addRecordsToRuns(game);
        // this.addOldRecordComparisons(oldRecords);
        this.oldRecords = oldRecords;
    }

    private addRecordsToRuns(game: Game): void {
        for (const run of this.runs) {
            run.recordTime = game.getRecord(
                run.category.slug,
                run.subcategory.slug,
            );
        }
    }

    // private addOldRecordComparisons(oldRecords: OldRecord[]): void {
    //     console.log(oldRecords);
    // }
}
