import _ from 'lodash';
import { Run } from './Run';
import { Game } from './Game';
import { Entry } from './Entry';
import { Category } from './Category';
import { Subcategory } from './Subcategory';
import { createArrayFromSet } from '@/helpers';
import { OldRecordCategoryJSON } from 'FirebaseTypes';

export interface MostPlayedSubcategory {
    category: Category;
    subcategory: Subcategory;
    attempts: number;
}

export class GameStats {
    public runs: Run[] = [];

    constructor(
        game: Game,
        entries: Entry[],
        oldRecords: OldRecordCategoryJSON[],
    ) {
        this.buildRunList(entries);
        this.addRecordsToRuns(game);
        this.addOldRecordToRuns(oldRecords);
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

    public getMostPlayedSubcategories(): MostPlayedSubcategory[] {
        const mostPlayedSubcategories: MostPlayedSubcategory[] = [];

        for (const run of this.runs) {
            const mostPlayedEntry = mostPlayedSubcategories.find(
                (mostPlayed) =>
                    mostPlayed.subcategory.slug === run.subcategory.slug &&
                    mostPlayed.category.slug === run.category.slug,
            );
            if (mostPlayedEntry) {
                mostPlayedEntry.attempts += run.attempts;
            } else {
                mostPlayedSubcategories.push({
                    category: run.category,
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

    private buildRunList(times: Entry[]): void {
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
    }

    private addRecordsToRuns(game: Game): void {
        for (const run of this.runs) {
            run.record = game.getRecord(
                run.category.slug,
                run.subcategory.slug,
            );
        }
    }

    private addOldRecordToRuns(oldRecords: OldRecordCategoryJSON[]): void {
        for (const run of this.runs) {
            const oldRecordCategory = oldRecords.find(
                (oldRecord) => oldRecord.categorySlug === run.category.slug,
            );
            const oldRecordSubcategory =
                oldRecordCategory?.subcategoryRecords.find(
                    (oldRecord) =>
                        oldRecord.subcategorySlug === run.subcategory.slug,
                );
            run.oldRecords = oldRecordSubcategory?.records;
        }
    }

    public getOldRecordCategories(): Category[] {
        const categoriesSet = new Set<Category>();
        for (const run of this.runs) {
            if (run.oldRecords) {
                categoriesSet.add(run.category);
            }
        }
        return createArrayFromSet(categoriesSet);
    }
}
