import { OldRecordCategoryJSON } from 'FirebaseTypes';
import _ from 'lodash';
import { Entry } from './Entry';
import { Game } from './Game';
import { Run } from './Run';
import { Subcategory } from './Subcategory';

export interface MostPlayedSubcategory {
    subcategory: Subcategory;
    attempts: number;
}

export class GameStats {
    public runs: Run[] = [];
    public oldRecords: OldRecordCategoryJSON[] = [];

    constructor(
        game: Game,
        entries: Entry[],
        oldRecords: OldRecordCategoryJSON[],
    ) {
        this.buildRunList(game, entries, oldRecords);
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
                game.getEntries(run.category.slug, run.subcategory.slug),
            );
        }
    }

    private calculateMostContested(entryList: Entry[]): number {
        const recordImprovements = _.filter(
            entryList,
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
                    recordImprovements[i].userId !==
                    recordImprovements[i - 1].userId
                )
                    count++;
            }
        }
        return count;
    }

    private buildRunList(
        game: Game,
        times: Entry[],
        oldRecords: OldRecordCategoryJSON[],
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
        this.oldRecords = oldRecords;
    }

    private addRecordsToRuns(game: Game): void {
        for (const run of this.runs) {
            run.record = game.getRecord(
                run.category.slug,
                run.subcategory.slug,
            );
        }
    }
}
