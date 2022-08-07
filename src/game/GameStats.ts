import _ from 'lodash';
import { Run } from './Run';
import { Game } from './Game';
import { Entry } from './Entry';
import { Category, DEFAULT_CATEGORY_JSON } from './Category';
import { Subcategory } from './Subcategory';
import { createArrayFromSet } from '@/helpers';
import { OldRecordCategoryJSON } from 'FirebaseTypes';

export interface RunSummaryRow {
    category: Category;
    subcategory: Subcategory;
    timesContested: number;
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
        this.assignRecordsToRuns(game);
        this.assignOldRecordToRuns(oldRecords);
        this.assignMostContestedCountToRuns(game);
    }

    public getRunSummary(): RunSummaryRow[] {
        const result = [
            ...this.buildRunSummary(),
            ...this.buildRunSummaryConsolidated(),
        ];

        return _.orderBy(result, ['attempts'], ['desc']);
    }

    private buildRunSummary(): RunSummaryRow[] {
        const result: RunSummaryRow[] = [];
        for (const run of this.runs) {
            result.push({
                category: run.category,
                subcategory: run.subcategory,
                attempts: run.attempts,
                timesContested: run.timesContested,
            });
        }
        return result;
    }

    // Consolidates subcategory data independent of category
    // Necessary for 'All Categories' option
    private buildRunSummaryConsolidated(): RunSummaryRow[] {
        const result: RunSummaryRow[] = [];
        for (const run of this.runs) {
            const mostPlayedEntry = result.find(
                (mostPlayed) =>
                    mostPlayed.subcategory.slug === run.subcategory.slug,
            );
            if (mostPlayedEntry) {
                mostPlayedEntry.attempts += run.attempts;
            } else {
                result.push({
                    category: new Category(DEFAULT_CATEGORY_JSON),
                    subcategory: run.subcategory,
                    attempts: run.attempts,
                    timesContested: run.timesContested,
                });
            }
        }
        return result;
    }

    private assignMostContestedCountToRuns(game: Game) {
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

    private assignRecordsToRuns(game: Game): void {
        for (const run of this.runs) {
            run.record = game.getRecord(
                run.category.slug,
                run.subcategory.slug,
            );
        }
    }

    private assignOldRecordToRuns(oldRecords: OldRecordCategoryJSON[]): void {
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
